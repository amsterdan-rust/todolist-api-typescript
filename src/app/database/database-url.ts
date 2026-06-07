export const databaseUrl =
  process.env.NODE_ENV === "test"
    ? "app.test.sqlite"
    : (process.env.DATABASE_URL ?? "app.sqlite");
