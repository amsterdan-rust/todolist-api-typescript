import { db } from "@app/database/local/db";

import { makeAuth } from "./auth.factory";

export const auth = makeAuth({
  db,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:8000",
});
