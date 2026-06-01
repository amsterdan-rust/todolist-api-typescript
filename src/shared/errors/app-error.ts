export type AppErrorCode = "not_found" | "validation_error" | "conflict";

type AppErrorInput = {
  code: AppErrorCode;
  message: string;
};

export const makeAppError = ({
  code,
  message,
}: AppErrorInput): Error & {
  code: AppErrorCode;
} =>
  Object.assign(new Error(message), {
    code,
  });
