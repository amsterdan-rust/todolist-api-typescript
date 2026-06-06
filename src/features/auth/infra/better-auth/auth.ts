import { betterAuth } from "better-auth";

import { makeCryptoIdGenerator } from "@/shared/id-generator";
import { authDatabase } from "./auth-database";

const idGenerator = makeCryptoIdGenerator();

export const auth = betterAuth({
  database: authDatabase,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:8000",
  basePath: "/auth",
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: () => idGenerator.generate(),
    },
  },
});
