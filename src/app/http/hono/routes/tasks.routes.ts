import { z } from "zod";
import type { Hono } from "hono";

import type { AppContainer } from "../../../container";

type RegisterTaskRoutesDeps = {
  app: Hono;
  container: AppContainer;
};

const createTaskBodySchema = z.object({
  userId: z.uuid(),
  categoryId: z.uuid().nullable().optional(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable().optional(),
});

export const registerTaskRoutes = ({
  app,
  container,
}: RegisterTaskRoutesDeps) => {
  app.post("/tasks", async (context) => {
    const body = createTaskBodySchema.parse(await context.req.json());

    const task = await container.taskUseCases.createTask({
      userId: body.userId,
      categoryId: body.categoryId ?? null,
      title: body.title,
      description: body.description ?? null,
    });

    return context.json(task, 201);
  });
};
