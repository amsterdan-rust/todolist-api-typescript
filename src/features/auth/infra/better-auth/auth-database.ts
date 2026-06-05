import { Database } from "bun:sqlite";

export const authDatabase = new Database(
  process.env.AUTH_DATABASE_URL ?? "auth.sqlite",
);
