import { createRoute, z } from "@hono/zod-openapi";

const deleteTaskParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

export const deleteTaskRoute = createRoute({
  method: "delete",
  path: "/tasks/{id}",
  tags: ["Tasks"],
  summary: "Delete task",
  request: {
    params: deleteTaskParamsSchema,
  },
  responses: {
    204: {
      description: "Task deleted",
    },
    404: {
      description: "Task not found",
    },
  },
});
