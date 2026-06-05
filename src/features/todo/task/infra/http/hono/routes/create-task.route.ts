import { createRoute, z } from "@hono/zod-openapi";

import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
} from "@todo/task/domain/task.constants";
import { taskResponseSchema } from "../task-response.schema";

const createTaskBodySchema = z.object({
  categoryId: z.uuid().nullable().optional().openapi({
    example: null,
  }),

  title: z
    .string()
    .trim()
    .min(TASK_TITLE_MIN_LENGTH)
    .max(TASK_TITLE_MAX_LENGTH)
    .openapi({
      example: "Comprar pão",
    }),

  description: z
    .string()
    .trim()
    .max(TASK_DESCRIPTION_MAX_LENGTH)
    .nullable()
    .optional()
    .openapi({
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
