import { Database } from "bun:sqlite";

import { databaseUrl } from "./database-url";

export const sqlite = new Database(databaseUrl);
