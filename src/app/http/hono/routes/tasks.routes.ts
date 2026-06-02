import { createRoute, z, type OpenAPIHono } from "@hono/zod-openapi";

import type { AppContainer } from "../../../container";
import { taskPresenter } from "./task.presenter";

type RegisterTaskRoutesDeps = {
  app: OpenAPIHono;
  container: AppContainer;
};

const taskResponseSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
  userId: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000002",
  }),
  categoryId: z.uuid().nullable().openapi({
    example: null,
  }),
  title: z.string().openapi({
    example: "Comprar pão",
  }),
  description: z.string().nullable().openapi({
    example: "Ir na padaria",
  }),
  status: z.enum(["pending", "done"]).openapi({
    example: "pending",
  }),
  createdAt: z.iso.datetime().openapi({
    example: "2026-01-01T00:00:00.000Z",
  }),
  updatedAt: z.iso.datetime().openapi({
    example: "2026-01-01T00:00:00.000Z",
  }),
});

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

const createTaskRoute = createRoute({
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

export const registerTaskRoutes = ({
  app,
  container,
}: RegisterTaskRoutesDeps) => {
  app.openapi(createTaskRoute, async (context) => {
    const body = context.req.valid("json");

    const task = await container.taskUseCases.createTask({
      userId: body.userId,
      categoryId: body.categoryId ?? null,
      title: body.title,
      description: body.description ?? null,
    });

    return context.json(taskPresenter.toHttp(task), 201);
  });
};
