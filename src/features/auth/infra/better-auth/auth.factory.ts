import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import * as schema from "@app/database/schema";
import { makeCryptoIdGenerator } from "@shared/id-generator";

type MakeAuthDeps = {
  db: Parameters<typeof drizzleAdapter>[0];
  baseURL: string;
};

const idGenerator = makeCryptoIdGenerator();

export const makeAuth = ({ db, baseURL }: MakeAuthDeps) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    baseURL,
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

export type Auth = ReturnType<typeof makeAuth>;
