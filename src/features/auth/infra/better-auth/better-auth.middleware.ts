import type { MiddlewareHandler } from "hono";

import { auth } from "./auth";

export type AuthVariables = {
  user: {
    id: string;
  };
};

export const betterAuthMiddleware =
  (): MiddlewareHandler<{
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
