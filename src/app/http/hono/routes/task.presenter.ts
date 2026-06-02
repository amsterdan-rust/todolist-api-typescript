import type { Task } from "@todo/task/domain/task.schema";

export type TaskResponse = {
  id: string;
  userId: string;
  categoryId: string | null;
  title: string;
  description: string | null;
  status: "pending" | "done";
  createdAt: string;
  updatedAt: string;
};

export const taskPresenter = {
  toHttp: (task: Task): TaskResponse => ({
    id: task.id,
    userId: task.userId,
    categoryId: task.categoryId,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }),
};
