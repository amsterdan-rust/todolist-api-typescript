import { z } from "zod";
import type { ErrorHandler } from "hono";

import type { AppErrorCode } from "@shared/errors/app-error";

type AppError = Error & {
  code?: AppErrorCode;
};

const statusByErrorCode = {
  not_found: 404,
  conflict: 409,
  validation_error: 400,
} as const satisfies Record<AppErrorCode, number>;

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

  const appError = error as AppError;

  if (appError.code) {
    return context.json(
      {
        message: appError.message,
      },
      statusByErrorCode[appError.code],
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
