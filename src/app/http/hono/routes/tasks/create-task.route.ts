import { createRoute, z } from "@hono/zod-openapi";

import { taskResponseSchema } from "./task-response.schema";

const createTaskBodySchema = z.object({
  userId: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000002",
  }),

  categoryId: z.uuid().nullable().optional().openapi({
    example: null,
  }),

  title: z.string().trim().min(1).max(120).openapi({
    example: "Comprar pão",
  }),

  description: z.string().trim().max(500).nullable().optional().openapi({
    example: "Ir na padaria",
  }),
});

export const createTaskRoute = createRoute({
  method: "post",
  path: "/tasks",
  tags: ["Tasks"],
  summary: "Create task",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createTaskBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Task created",
      content: {
        "application/json": {
          schema: taskResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
    },
  },
});
