import { describe, expect, it } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";

type BetterAuthUserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

type BetterAuthSessionResponse = {
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: BetterAuthUserResponse["user"];
};

describe("Better Auth HTTP routes", () => {
  it("handles auth routes", async () => {
    const app = makeHonoApp({ container: makeContainer() });

    const response = await app.request("/auth/get-session");

    expect(response.status).not.toBe(404);
  });

  it("signs up a user with email and password", async () => {
    const app = makeHonoApp({ container: makeContainer() });
    const email = `test-${crypto.randomUUID()}@example.com`;

    const response = await app.request("/auth/sign-up/email", {
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

    const body = (await response.json()) as BetterAuthUserResponse;

    expect(response.status).toBe(200);
    expect(body.user.email).toBe(email);
    expect(body.user.name).toBe("Test User");
  });

  it("does not sign up a user with an already used email", async () => {
    const app = makeHonoApp({ container: makeContainer() });
    const email = `test-${crypto.randomUUID()}@example.com`;

    await app.request("/auth/sign-up/email", {
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

    const response = await app.request("/auth/sign-up/email", {
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

    expect(response.status).toBe(422);
  });

  it("signs in a user with email and password", async () => {
    const app = makeHonoApp({ container: makeContainer() });
    const email = `test-${crypto.randomUUID()}@example.com`;
    const password = "password123";

    await app.request("/auth/sign-up/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email,
        password,
      }),
    });

    const response = await app.request("/auth/sign-in/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const body = (await response.json()) as BetterAuthUserResponse;

    expect(response.status).toBe(200);
    expect(body.user.email).toBe(email);
  });

  it("gets the current session using the auth cookie", async () => {
    const app = makeHonoApp({ container: makeContainer() });
    const email = `test-${crypto.randomUUID()}@example.com`;
    const password = "password123";

    const signUpResponse = await app.request("/auth/sign-up/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email,
        password,
      }),
    });

    const cookie = signUpResponse.headers.get("set-cookie");

    expect(signUpResponse.status).toBe(200);
    expect(cookie).toBeTruthy();

    const sessionResponse = await app.request("/auth/get-session", {
      headers: {
        cookie: cookie ?? "",
      },
    });

    const body = (await sessionResponse.json()) as BetterAuthSessionResponse;

    expect(sessionResponse.status).toBe(200);
    expect(body.user.email).toBe(email);
  });
});
