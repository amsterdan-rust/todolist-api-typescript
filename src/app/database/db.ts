import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";
import { sqlite } from "./sqlite";

export const db = drizzle(sqlite, {
  schema,
});
