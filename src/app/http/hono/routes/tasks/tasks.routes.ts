import type { OpenAPIHono } from "@hono/zod-openapi";

import type { AppContainer } from "../../../../container";
import { createTaskRoute } from "./create-task.route";
import { listTasksRoute } from "./list-tasks.route";
import { taskPresenter } from "./task.presenter";

type RegisterTaskRoutesDeps = {
  app: OpenAPIHono;
  container: AppContainer;
};

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

  app.openapi(listTasksRoute, async (context) => {
    const query = context.req.valid("query");

    const tasks = await container.taskUseCases.listTasks({
      userId: query.userId,
      ...(query.status !== undefined && { status: query.status }),
      ...(query.categoryId !== undefined && { categoryId: query.categoryId }),
      ...(query.title !== undefined && { title: query.title }),
      ...(query.orderBy !== undefined && { orderBy: query.orderBy }),
      ...(query.orderDirection !== undefined && {
        orderDirection: query.orderDirection,
      }),
    });

    return context.json(tasks.map(taskPresenter.toHttp), 200);
  });
};
