import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { Scalar } from "@scalar/hono-api-reference";

import type { AppContainer } from "@app/composition/make-app-container";
import {
  makeBetterAuthMiddleware,
  type AuthVariables,
} from "@auth/infra/better-auth/better-auth.middleware";
import type { Auth } from "@auth/infra/better-auth/auth.factory";
import { registerAuthRoutes } from "@auth/infra/http/hono/routes/auth.routes";
import { registerTaskRoutes } from "@features/todo/task/infra/http/hono/routes/tasks.routes";
import { registerCategoryRoutes } from "@todo/category/infra/http/hono/routes/categories.routes";
import { makeHonoErrorHandler } from "./hono-error-handler";

type MakeHonoAppDeps = {
  container: AppContainer;
  auth: Auth;
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

const allowedOrigins = [
  "http://localhost:3000",
  "https://todolist-api.amsterdan-todolist.workers.dev",
];

export const makeHonoApp = ({ container, auth }: MakeHonoAppDeps) => {
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

  app.use(
    "*",
    cors({
      origin: (origin) => {
        if (!origin) {
          return allowedOrigins[0];
        }

        if (allowedOrigins.includes(origin)) {
          return origin;
        }

        return allowedOrigins[0];
      },
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

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

  app.on(["POST", "GET"], "/auth/*", (context) =>
    auth.handler(context.req.raw),
  );

  registerAuthRoutes({
    app,
    auth,
  });

  const authMiddleware = makeBetterAuthMiddleware({
    auth,
  });

  app.use("/tasks", authMiddleware);
  app.use("/tasks/*", authMiddleware);

  app.use("/categories", authMiddleware);
  app.use("/categories/*", authMiddleware);

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
