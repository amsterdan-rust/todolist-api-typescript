import { createRoute, z } from "@hono/zod-openapi";

import { taskResponseSchema } from "./task-response.schema";

const listTasksQuerySchema = z.object({
  userId: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000002",
  }),

  status: z.enum(["pending", "done"]).optional().openapi({
    example: "pending",
  }),

  categoryId: z.uuid().nullable().optional().openapi({
    example: null,
  }),

  title: z.string().optional().openapi({
    example: "pão",
  }),

  orderBy: z.enum(["createdAt", "updatedAt"]).optional().openapi({
    example: "createdAt",
  }),

  orderDirection: z.enum(["asc", "desc"]).optional().openapi({
    example: "desc",
  }),
});

export const listTasksRoute = createRoute({
  method: "get",
  path: "/tasks",
  tags: ["Tasks"],
  summary: "List tasks",
  request: {
    query: listTasksQuerySchema,
  },
  responses: {
    200: {
      description: "Tasks listed",
      content: {
        "application/json": {
          schema: z.array(taskResponseSchema),
        },
      },
    },
    400: {
      description: "Validation error",
    },
  },
});
