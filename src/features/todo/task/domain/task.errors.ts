import { makeAppError } from "@shared/errors/app-error";

export const taskError = {
  NotFound: () =>
    makeAppError({
      code: "not_found",
      message: "Task not found",
    }),

  AlreadyCompleted: () =>
    makeAppError({
      code: "conflict",
      message: "Task already completed",
    }),

  AlreadyPending: () =>
    makeAppError({
      code: "conflict",
      message: "Task already pending",
    }),
};
