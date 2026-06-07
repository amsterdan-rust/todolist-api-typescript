import type { D1Database } from "@cloudflare/workers-types";
import { Hono } from "hono";

type Env = {
  Bindings: {
    DB: D1Database;
  };
};

const app = new Hono<Env>();

app.get("/health", (c) =>
  c.json({
    status: "ok",
  }),
);

app.get("/debug/db", async (c) => {
  const result = await c.env.DB.prepare("SELECT 1 as ok").first();

  return c.json(result);
});

export default app;
