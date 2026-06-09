import { describe, expect, it } from "bun:test";
import { Hono } from "hono";

import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { makeHonoApp } from "@app/http/hono/make-hono-app";
import { auth } from "@auth/infra/better-auth/auth";

import { makeBetterAuthMiddleware } from "./better-auth.middleware";

type ProtectedUserResponse = {
  user: {
    id: string;
  };
};

describe("betterAuthMiddleware", () => {
  it("returns unauthorized when request has no session", async () => {
    const app = new Hono();

    app.use(
      "/protected/*",
      makeBetterAuthMiddleware({
        auth,
      }),
    );

    app.get("/protected/me", (c) => c.json({ user: c.get("user") }));

    const response = await app.request("/protected/me");

    expect(response.status).toBe(401);
  });

  it("sets authenticated user when request has a valid session", async () => {
    const authApp = makeHonoApp({
      auth,
      container: makeInMemoryContainer(),
    });

    const email = `test-${crypto.randomUUID()}@example.com`;

    const signUpResponse = await authApp.request("/auth/sign-up/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email,
        password: "password123",
      }),
    });

    const cookie = signUpResponse.headers.get("set-cookie");

    expect(signUpResponse.status).toBe(200);
    expect(cookie).toBeTruthy();

    const app = new Hono();

    app.use(
      "/protected/*",
      makeBetterAuthMiddleware({
        auth,
      }),
    );

    app.get("/protected/me", (c) => c.json({ user: c.get("user") }));

    const response = await app.request("/protected/me", {
      headers: {
        cookie: cookie ?? "",
      },
    });

    const body = (await response.json()) as ProtectedUserResponse;

    expect(response.status).toBe(200);
    expect(body.user.id).toBeString();
  });
});
