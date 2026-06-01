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

export type ListTasksInput = {
  userId: string;
  status?: TaskStatus;
  categoryId?: string | null;
  title?: string;
  orderBy?: "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
};

export type RemoveCategoryFromTasksInput = {
  categoryId: string;
  updatedAt: Date;
};

export type TaskRepository = {
  create: (task: Task) => Promise<Task>;

  existsById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<Task | null>;

  complete: (input: CompleteTaskInput) => Promise<TaskMutationResult>;
  reopen: (input: ReopenTaskInput) => Promise<TaskMutationResult>;

  update: (input: UpdateTaskInput) => Promise<TaskMutationResult>;

  delete: (id: string) => Promise<void>;

  list: (input: ListTasksInput) => Promise<Task[]>;

  removeCategory: (input: RemoveCategoryFromTasksInput) => Promise<void>;
};
