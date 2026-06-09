import { makeLocalContainer } from "@/app/composition/make-local-container";
import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { makeHonoApp } from "@app/http/hono/make-hono-app";
import { auth } from "@auth/infra/better-auth/auth";

type TestApp = {
  request: (path: string, init?: RequestInit) => Response | Promise<Response>;
};

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

export const signUpTestUser = async (app: TestApp) => {
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

  const cookie = response.headers.get("set-cookie");

  if (!cookie) throw new Error("Auth cookie was not returned.");

  const body = (await response.json()) as BetterAuthUserResponse;

  return {
    cookie,
    headers: {
      cookie,
    },
    user: body.user,
  };
};

export const signUpAndGetAuthCookie = async (app: TestApp) => {
  const { cookie } = await signUpTestUser(app);

  return cookie;
};

export const makeAuthHeaders = async (app: TestApp) => ({
  cookie: await signUpAndGetAuthCookie(app),
});

export const makeInMemoryTestApp = () =>
  makeHonoApp({
    auth,
    container: makeInMemoryContainer(),
  });

export const makeLocalHttpTestApp = () =>
  makeHonoApp({
    auth,
    container: makeLocalContainer(),
  });
