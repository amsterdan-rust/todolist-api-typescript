import { defineConfig } from "drizzle-kit";

const databaseUrl =
  Bun.env.NODE_ENV === "test" ? "app.test.sqlite" : "app.sqlite";

export default defineConfig({
  schema: "./src/app/database/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
