import type { OpenAPIHono } from "@hono/zod-openapi";

import type { AppContainer } from "@app/container";
import type { AuthVariables } from "@app/http/hono/middlewares/fake-auth.middleware";
import { createTaskRoute } from "./create-task.route";
import { getTaskRoute } from "./get-task.route";
import { listTasksRoute } from "./list-tasks.route";
import { taskMutationPresenter } from "./task-mutation.presenter";
import { taskPresenter } from "./task.presenter";
import { updateTaskRoute } from "./update-task.route";
import { completeTaskRoute } from "./complete-task.route";
import { reopenTaskRoute } from "./reopen-task.route";
import { deleteTaskRoute } from "./delete-task.route";

type RegisterTaskRoutesDeps = {
  app: OpenAPIHono<{
    Variables: AuthVariables;
  }>;
  container: AppContainer;
};

export const registerTaskRoutes = ({
  app,
  container,
}: RegisterTaskRoutesDeps) => {
  app.openapi(createTaskRoute, async (context) => {
    const body = context.req.valid("json");
    const auth = context.get("auth");

    const task = await container.taskUseCases.createTask({
      userId: auth.userId,
      categoryId: body.categoryId ?? null,
      title: body.title,
      description: body.description ?? null,
    });

    return context.json(taskPresenter.toHttp(task), 201);
  });

  app.openapi(listTasksRoute, async (context) => {
    const query = context.req.valid("query");
    const auth = context.get("auth");

    const tasks = await container.taskUseCases.listTasks({
      userId: auth.userId,
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

  app.openapi(getTaskRoute, async (context) => {
    const params = context.req.valid("param");
    const auth = context.get("auth");

    const task = await container.taskUseCases.getTask({
      id: params.id,
      userId: auth.userId,
    });

    return context.json(taskPresenter.toHttp(task), 200);
  });

  app.openapi(updateTaskRoute, async (context) => {
    const params = context.req.valid("param");
    const body = context.req.valid("json");
    const auth = context.get("auth");

    const result = await container.taskUseCases.updateTask({
      id: params.id,
      userId: auth.userId,
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && {
        description: body.description,
      }),
      ...(body.categoryId !== undefined && {
        categoryId: body.categoryId,
      }),
    });

    return context.json(taskMutationPresenter.toHttp(result), 200);
  });

  app.openapi(completeTaskRoute, async (context) => {
    const params = context.req.valid("param");
    const auth = context.get("auth");

    const result = await container.taskUseCases.completeTask({
      id: params.id,
      userId: auth.userId,
    });

    return context.json(taskMutationPresenter.toHttp(result), 200);
  });

  app.openapi(reopenTaskRoute, async (context) => {
    const params = context.req.valid("param");
    const auth = context.get("auth");

    const result = await container.taskUseCases.reopenTask({
      id: params.id,
      userId: auth.userId,
    });

    return context.json(taskMutationPresenter.toHttp(result), 200);
  });

  app.openapi(deleteTaskRoute, async (context) => {
    const params = context.req.valid("param");
    const auth = context.get("auth");

    await container.taskUseCases.deleteTask({
      id: params.id,
      userId: auth.userId,
    });

    return context.body(null, 204);
  });
};
