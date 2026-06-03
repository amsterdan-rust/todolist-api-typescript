import { createRoute, z } from "@hono/zod-openapi";

import { taskMutationResponseSchema } from "../task-mutation-response.schema";

const reopenTaskParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

export const reopenTaskRoute = createRoute({
  method: "patch",
  path: "/tasks/{id}/reopen",
  tags: ["Tasks"],
  summary: "Reopen task",
  request: {
    params: reopenTaskParamsSchema,
  },
  responses: {
    200: {
      description: "Task reopened",
      content: {
        "application/json": {
          schema: taskMutationResponseSchema,
        },
      },
    },
    404: {
      description: "Task not found",
    },
  },
});
