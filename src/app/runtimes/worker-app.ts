import { sql } from "drizzle-orm";
import { Hono } from "hono";

import { makeWorkerContainer } from "@app/composition/make-worker-container";
import { makeD1Database } from "@app/database/worker/d1";
import { makeHonoApp } from "@app/http/hono/make-hono-app";
import { makeAuth } from "@auth/infra/better-auth/auth.factory";
import type { D1Database } from "@cloudflare/workers-types";

type Env = {
  Bindings: {
    DB: D1Database;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
  };
};

const app = new Hono<Env>();

app.get("/debug/db", async (context) => {
  const result = await context.env.DB.prepare("SELECT 1 as ok").first();

  return context.json(result);
});

app.get("/debug/drizzle", async (context) => {
  const db = makeD1Database(context.env.DB);

  const result = await db.get<{ ok: number }>(sql`SELECT 1 as ok`);

  return context.json(result);
});

app.get("/debug/tables", async (context) => {
  const db = makeD1Database(context.env.DB);

  const tables = await db.all<{ name: string }>(sql`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
  `);

  return context.json({
    tables,
  });
});

app.all("*", (context) => {
  const db = makeD1Database(context.env.DB);

  const auth = makeAuth({
    db,
    baseURL: context.env.BETTER_AUTH_URL,
    secret: context.env.BETTER_AUTH_SECRET,
  });

  const container = makeWorkerContainer({
    db,
  });

  const honoApp = makeHonoApp({
    auth,
    container,
  });

  return honoApp.fetch(context.req.raw, context.env);
});

export default app;
