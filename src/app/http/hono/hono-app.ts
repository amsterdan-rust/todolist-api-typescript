import { Hono } from "hono";

import { makeHonoErrorHandler } from "./hono-error-handler";

export const makeHonoApp = () => {
  const app = new Hono();

  app.onError(makeHonoErrorHandler());

  app.get("/health", (context) =>
    context.json({
      status: "ok",
    }),
  );

  return app;
};
