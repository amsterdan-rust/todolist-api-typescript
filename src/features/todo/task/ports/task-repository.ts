import type { Task, TaskStatus } from "../domain/task.schema";

export type TaskMutationResult = {
  id: string;
  updatedAt: Date;
};

export type CompleteTaskInput = {
  id: string;
  updatedAt: Date;
};

export type ReopenTaskInput = {
  id: string;
  updatedAt: Date;
};

export type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string | null;
  categoryId?: string | null;
  updatedAt: Date;
};

export type TaskRepository = {
  create: (task: Task) => Promise<Task>;

  existsById: (id: string) => Promise<boolean>;

  complete: (input: CompleteTaskInput) => Promise<TaskMutationResult>;
  reopen: (input: ReopenTaskInput) => Promise<TaskMutationResult>;

  update: (input: UpdateTaskInput) => Promise<TaskMutationResult>;
};
