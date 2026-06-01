import { makeAppError } from "@shared/errors/app-error";

export const taskError = {
  NotFound: () =>
    makeAppError({
      code: "not_found",
      message: "Task not found",
    }),
};
