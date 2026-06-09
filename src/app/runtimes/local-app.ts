import { makeLocalContainer } from "../composition/make-local-container";
import { makeHonoApp } from "@app/http/hono/make-hono-app";
import { auth } from "@auth/infra/better-auth/auth";

const container = makeLocalContainer();

const app = makeHonoApp({
  container,
  auth,
});

export default app;
