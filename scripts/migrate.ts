import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { sqlite } from "@/app/database/sqlite";

const migrationsDir = "drizzle";

const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const file of migrationFiles) {
  const migrationPath = join(migrationsDir, file);
  const sql = readFileSync(migrationPath, "utf-8");

  sqlite.exec(sql);

  console.log(`Applied migration: ${file}`);
}
