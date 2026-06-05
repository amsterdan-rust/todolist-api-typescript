import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import type { AppContainer } from "@app/container";
import { makeHonoErrorHandler } from "./hono-error-handler";
import { registerTaskRoutes } from "@features/todo/task/infra/http/hono/routes/tasks.routes";
import {
  fakeAuthMiddleware,
  type AuthVariables,
} from "./middlewares/fake-auth.middleware";
import { registerCategoryRoutes } from "@/features/todo/category/http/hono/routes/categories.routes";

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

  app.use("/tasks", fakeAuthMiddleware);
  app.use("/tasks/*", fakeAuthMiddleware);

  app.use("/categories", fakeAuthMiddleware);
  app.use("/categories/*", fakeAuthMiddleware);

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
