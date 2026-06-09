// src/app/worker.ts
import { Hono } from "hono";
import { sql } from "drizzle-orm";

import { makeD1Database } from "../database/worker/d1";
import type { D1Database } from "@cloudflare/workers-types";
import { makeAuth } from "@/features/auth/infra/better-auth/auth.factory";

type Env = {
  Bindings: {
    DB: D1Database;
    BETTER_AUTH_URL: string;
  };
};

const app = new Hono<Env>();

app.on(["POST", "GET"], "/auth/*", (c) => {
  const db = makeD1Database(c.env.DB);

  const auth = makeAuth({
    db,
    baseURL: c.env.BETTER_AUTH_URL,
  });

  return auth.handler(c.req.raw);
});

app.get("/health", (c) =>
  c.json({
    status: "ok",
  }),
);

app.get("/debug/db", async (c) => {
  const result = await c.env.DB.prepare("SELECT 1 as ok").first();

  return c.json(result);
});

app.get("/debug/drizzle", async (c) => {
  const db = makeD1Database(c.env.DB);

  const result = await db.get<{ ok: number }>(sql`SELECT 1 as ok`);

  return c.json(result);
});

app.get("/debug/tables", async (c) => {
  const db = makeD1Database(c.env.DB);

  const tables = await db.all<{ name: string }>(sql`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
  `);

  return c.json({
    tables,
  });
});

export default app;
