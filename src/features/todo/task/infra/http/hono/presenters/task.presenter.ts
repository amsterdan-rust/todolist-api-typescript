import type { Task } from "@todo/task/domain/task.schema";
import type { TaskResponse } from "../responses/task-response.schema";

export const taskPresenter = {
  toHttp: (task: Task): TaskResponse => ({
    id: task.id,
    categoryId: task.categoryId,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }),
};
