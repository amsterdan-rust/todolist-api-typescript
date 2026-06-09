import { describe, expect, test } from "bun:test";

import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { signUpTestUser } from "@app/test-support/http/http-auth-test-helpers";
import { readJson } from "@app/test-support/http/http-test-helpers";

import type { MeResponse } from "../../responses/me-response.schema";

type UnauthorizedResponse = {
  message: string;
};

describe("GET /me", () => {
  test("returns unauthorized when request has no session", async () => {
    const app = makeHonoApp({
      container: makeInMemoryContainer(),
    });

    const response = await app.request("/me");

    expect(response.status).toBe(401);

    const body = await readJson<UnauthorizedResponse>(response);

    expect(body).toEqual({
      message: "Unauthorized",
    });
  });

  test("returns the current authenticated user", async () => {
    const app = makeHonoApp({
      container: makeInMemoryContainer(),
    });

    const { headers, user } = await signUpTestUser(app);

    const response = await app.request("/me", {
      headers,
    });

    expect(response.status).toBe(200);

    const body = await readJson<MeResponse>(response);

    expect(body).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      },
    });
  });

  test("returns unauthorized after sign out", async () => {
    const app = makeHonoApp({
      container: makeInMemoryContainer(),
    });

    const { headers } = await signUpTestUser(app);

    const meBeforeSignOutResponse = await app.request("/me", {
      headers,
    });

    expect(meBeforeSignOutResponse.status).toBe(200);

    const signOutResponse = await app.request("/auth/sign-out", {
      method: "POST",
      headers,
    });

    expect(signOutResponse.status).toBe(200);

    const meAfterSignOutResponse = await app.request("/me", {
      headers,
    });

    expect(meAfterSignOutResponse.status).toBe(401);
  });
});
