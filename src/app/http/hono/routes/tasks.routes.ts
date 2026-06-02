import { createRoute, z, type OpenAPIHono } from "@hono/zod-openapi";

import type { AppContainer } from "../../../container";
import { taskPresenter } from "./task.presenter";

type RegisterTaskRoutesDeps = {
  app: OpenAPIHono;
  container: AppContainer;
};

const taskResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  categoryId: z.uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(["pending", "done"]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const createTaskBodySchema = z.object({
  userId: z.uuid(),
  categoryId: z.uuid().nullable().optional(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable().optional(),
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
