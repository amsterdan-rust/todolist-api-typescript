import { makeContainer } from "./container";
import { makeHonoApp } from "./http/hono/hono-app";

const container = makeContainer();

const app = makeHonoApp({
  container,
});

export default app;
