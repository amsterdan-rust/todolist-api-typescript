import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import type { AppContainer } from "@app/composition/make-app-container";
import {
  betterAuthMiddleware,
  type AuthVariables,
} from "@auth/infra/better-auth/better-auth.middleware";
import { betterAuthHandler } from "@features/auth/infra/better-auth/better-auth.handler";
import { registerTaskRoutes } from "@features/todo/task/infra/http/hono/routes/tasks.routes";
import { registerCategoryRoutes } from "@todo/category/infra/http/hono/routes/categories.routes";
import { makeHonoErrorHandler } from "./hono-error-handler";
import { registerAuthRoutes } from "@auth/infra/http/hono/routes/auth.routes";

type MakeHonoAppDeps = {
  container: AppContainer;
};

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Check API health",
  responses: {
    200: {
      description: "API is healthy",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("ok").openapi({
              example: "ok",
            }),
          }),
        },
      },
    },
  },
});

export const makeHonoApp = ({ container }: MakeHonoAppDeps) => {
  const app = new OpenAPIHono<{
    Variables: AuthVariables;
  }>({
    defaultHook: (result, context) => {
      if (!result.success) {
        return context.json(
          {
            message: "Validation error",
            issues: result.error.issues,
          },
          400,
        );
      }
    },
  });

  app.onError(makeHonoErrorHandler());

  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Todo List API",
      version: "0.1.0",
    },
  });

  app.get(
    "/docs",
    Scalar({
      url: "/doc",
      pageTitle: "Todo List API Docs",
    }),
  );

  app.openapi(healthRoute, (context) =>
    context.json({
      status: "ok",
    }),
  );

  app.on(["POST", "GET"], "/auth/*", (c) => betterAuthHandler(c.req.raw));

  registerAuthRoutes({
    app,
  });

  app.use("/tasks", betterAuthMiddleware());
  app.use("/tasks/*", betterAuthMiddleware());

  app.use("/categories", betterAuthMiddleware());
  app.use("/categories/*", betterAuthMiddleware());

  registerTaskRoutes({
    app,
    container,
  });

  registerCategoryRoutes({
    app,
    container,
  });

  return app;
};
