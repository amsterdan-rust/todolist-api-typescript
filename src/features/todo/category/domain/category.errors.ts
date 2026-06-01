import { makeAppError } from "@shared/errors/app-error";

export const categoryError = {
  NotFound: () =>
    makeAppError({
      code: "not_found",
      message: "Category not found",
    }),
};
