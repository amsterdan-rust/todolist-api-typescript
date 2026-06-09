import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import * as schema from "@app/database/schema";
import { makeCryptoIdGenerator } from "@shared/id-generator";

type MakeAuthDeps = {
  db: Parameters<typeof drizzleAdapter>[0];
};

const idGenerator = makeCryptoIdGenerator();

export const makeAuth = ({ db }: MakeAuthDeps) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
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
