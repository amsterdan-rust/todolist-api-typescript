import { drizzle } from "drizzle-orm/d1";

import * as schema from "../schema";
import type { D1Database } from "@cloudflare/workers-types";

export type D1DatabaseBinding = D1Database;

export const makeD1Database = (database: D1DatabaseBinding) =>
  drizzle(database, {
    schema,
  });
