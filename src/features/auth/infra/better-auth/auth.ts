import { betterAuth } from "better-auth";
import { authDatabase } from "./auth-database";

export const auth = betterAuth({
  database: authDatabase,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/auth",
  emailAndPassword: {
    enabled: true,
  },
});
