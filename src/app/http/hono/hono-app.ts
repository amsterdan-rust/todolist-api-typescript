import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import type { AppContainer } from "../../container";
import { makeHonoErrorHandler } from "./hono-error-handler";
import { registerTaskRoutes } from "./routes/tasks.routes";

type MakeHonoAppDeps = {
  container: AppContainer;
};

export const makeHonoApp = ({ container }: MakeHonoAppDeps) => {
  const app = new OpenAPIHono();

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

  app.get("/health", (context) =>
    context.json({
      status: "ok",
    }),
  );

  registerTaskRoutes({
    app,
    container,
  });

  return app;
};
