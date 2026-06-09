import type { MiddlewareHandler } from "hono";

import type { Auth } from "./auth.factory";

export type AuthVariables = {
  user: {
    id: string;
  };
};

type MakeBetterAuthMiddlewareDeps = {
  auth: Auth;
};

export const makeBetterAuthMiddleware =
  ({
    auth,
  }: MakeBetterAuthMiddlewareDeps): MiddlewareHandler<{
    Variables: AuthVariables;
  }> =>
  async (c, next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401,
      );
    }

    c.set("user", {
      id: session.user.id,
    });

    await next();
  };
