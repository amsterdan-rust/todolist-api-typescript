import { createMiddleware } from "hono/factory";

export type AuthContext = {
  userId: string;
};

export type AuthVariables = {
  auth: AuthContext;
};

const FAKE_AUTH_USER_ID = "0195f6f9-391f-7000-8000-000000000002";

export const fakeAuthMiddleware = createMiddleware<{
  Variables: AuthVariables;
}>(async (context, next) => {
  context.set("auth", {
    userId: FAKE_AUTH_USER_ID,
  });

  await next();
});
