import { db } from "@app/database/local/db";

import { makeAuth } from "./auth.factory";

export const auth = makeAuth({
  db,
});
