import { Hono } from "hono";

import type { makeContainer } from "../../container";
import { makeHonoErrorHandler } from "./hono-error-handler";

type Container = ReturnType<typeof makeContainer>;

type MakeHonoAppDeps = {
  container: Container;
};

export const makeHonoApp = ({ container }: MakeHonoAppDeps) => {
  const app = new Hono();

  app.onError(makeHonoErrorHandler());

  app.get("/health", (context) =>
    context.json({
      status: "ok",
    }),
  );

  return app;
};
