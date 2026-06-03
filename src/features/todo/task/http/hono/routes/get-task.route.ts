import { createRoute, z } from "@hono/zod-openapi";

import { taskResponseSchema } from "../task-response.schema";

const getTaskParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

export const getTaskRoute = createRoute({
  method: "get",
  path: "/tasks/{id}",
  tags: ["Tasks"],
  summary: "Get task by id",
  request: {
    params: getTaskParamsSchema,
  },
  responses: {
    200: {
      description: "Task found",
      content: {
        "application/json": {
          schema: taskResponseSchema,
        },
      },
    },
    404: {
      description: "Task not found",
    },
  },
});
