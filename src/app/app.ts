import { makeProductionContainer } from "./production-container";
import { makeHonoApp } from "./http/hono/hono-app";

const container = makeProductionContainer();

const app = makeHonoApp({
  container,
});

export default app;
