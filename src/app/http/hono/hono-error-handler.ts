import { z } from "zod";
import type { ErrorHandler } from "hono";

export const makeHonoErrorHandler = (): ErrorHandler => (error, context) => {
  if (error instanceof z.ZodError) {
    return context.json(
      {
        message: "Validation error",
        issues: error.issues,
      },
      400,
    );
  }

  console.error(error);

  return context.json(
    {
      message: "Internal server error",
    },
    500,
  );
};
