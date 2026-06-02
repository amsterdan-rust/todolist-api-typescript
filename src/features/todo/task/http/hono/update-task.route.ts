import { createRoute, z } from "@hono/zod-openapi";

import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
} from "@todo/task/domain/task.constants";
import { taskMutationResponseSchema } from "./task-mutation-response.schema";

const updateTaskParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

const updateTaskBodySchema = z.object({
  categoryId: z.uuid().nullable().optional().openapi({
    example: null,
  }),

  title: z
    .string()
    .trim()
    .min(TASK_TITLE_MIN_LENGTH)
    .max(TASK_TITLE_MAX_LENGTH)
    .optional()
    .openapi({
      example: "Comprar leite",
    }),

  description: z
    .string()
    .trim()
    .max(TASK_DESCRIPTION_MAX_LENGTH)
    .nullable()
    .optional()
    .openapi({
      example: "Comprar leite integral",
    }),
});

export const updateTaskRoute = createRoute({
  method: "patch",
  path: "/tasks/{id}",
  tags: ["Tasks"],
  summary: "Update task",
  request: {
    params: updateTaskParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateTaskBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Task updated",
      content: {
        "application/json": {
          schema: taskMutationResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
    },
    404: {
      description: "Task not found",
    },
  },
});
