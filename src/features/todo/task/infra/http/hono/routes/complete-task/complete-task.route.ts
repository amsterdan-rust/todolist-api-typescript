import { createRoute, z } from "@hono/zod-openapi";

import { taskMutationResponseSchema } from "../../responses/task-mutation-response.schema";

const completeTaskParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

export const completeTaskRoute = createRoute({
  method: "patch",
  path: "/tasks/{id}/complete",
  tags: ["Tasks"],
  summary: "Complete task",
  request: {
    params: completeTaskParamsSchema,
  },
  responses: {
    200: {
      description: "Task completed",
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
