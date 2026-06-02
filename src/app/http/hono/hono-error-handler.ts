import type { ErrorHandler } from "hono";

export const makeHonoErrorHandler = (): ErrorHandler => (error, context) => {
  console.error(error);

  return context.json(
    {
      message: "Internal server error",
    },
    500,
  );
};
