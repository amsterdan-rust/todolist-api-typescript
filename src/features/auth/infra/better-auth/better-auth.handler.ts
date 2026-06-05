import { auth } from "./auth";

export const betterAuthHandler = async (request: Request) => {
  return auth.handler(request);
};
