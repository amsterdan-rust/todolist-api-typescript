import { makeLocalContainer } from "../composition/make-local-container";
import { makeHonoApp } from "@app/http/hono/make-hono-app";

const container = makeLocalContainer();

const app = makeHonoApp({
  container,
});

export default app;
