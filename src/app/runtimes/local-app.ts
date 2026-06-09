import { makeLocalContainer } from "../composition/make-local-container";
import { makeHonoApp } from "../http/hono/hono-app";

const container = makeLocalContainer();

const app = makeHonoApp({
  container,
});

export default app;
