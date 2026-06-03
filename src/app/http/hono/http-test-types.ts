export type ErrorHttpResponse = {
  message: string;
};

export type ValidationErrorHttpResponse = {
  message: "Validation error";
  issues: unknown[];
};
