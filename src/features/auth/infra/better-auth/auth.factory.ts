import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";

import * as schema from "@app/database/schema";
import { makeCryptoIdGenerator } from "@shared/id-generator";

type MakeAuthDeps = {
  db: Parameters<typeof drizzleAdapter>[0];
  baseURL: string;
  secret: string;
  trustedOrigins: string[];
};

const idGenerator = makeCryptoIdGenerator();

export const makeAuth = ({
  db,
  baseURL,
  secret,
  trustedOrigins,
}: MakeAuthDeps) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    baseURL,
    basePath: "/auth",
    secret,
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      database: {
        generateId: () => idGenerator.generate(),
      },
    },
  });

export type Auth = ReturnType<typeof makeAuth>;
