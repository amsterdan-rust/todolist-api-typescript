import { Hono } from "hono";

import type { AppContainer } from "../../container";
import { makeHonoErrorHandler } from "./hono-error-handler";
import { registerTaskRoutes } from "./routes/tasks.routes";

type MakeHonoAppDeps = {
  container: AppContainer;
};

export const makeHonoApp = ({ container }: MakeHonoAppDeps) => {
  const app = new Hono();

  app.onError(makeHonoErrorHandler());

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
