import type { OpenAPIHono } from "@hono/zod-openapi";

import { auth } from "@features/auth/infra/better-auth/auth";
import type { AuthVariables } from "@features/auth/infra/better-auth/better-auth.middleware";

import type { MeResponse } from "../responses/me-response.schema";
import { getMeRoute } from "./get-me/get-me.route";

type RegisterAuthRoutesDeps = {
  app: OpenAPIHono<{
    Variables: AuthVariables;
  }>;
};

export const registerAuthRoutes = ({ app }: RegisterAuthRoutesDeps) => {
  app.openapi(getMeRoute, async (context) => {
    const session = await auth.api.getSession({
      headers: context.req.raw.headers,
    });

    if (!session) {
      return context.json(
        {
          message: "Unauthorized",
        },
        401,
      );
    }

    const response: MeResponse = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image ?? null,
      },
    };

    return context.json(response, 200);
  });
};
