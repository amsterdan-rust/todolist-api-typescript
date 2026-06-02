import type { Task, TaskStatus } from "../domain/task.schema";

export type TaskRepositoryMutationResult = {
  id: string;
  updatedAt: Date;
};

export type CompleteTaskRecordInput = {
  id: string;
  updatedAt: Date;
};

export type ReopenTaskRecordInput = {
  id: string;
  updatedAt: Date;
};

export type UpdateTaskRecordInput = {
  id: string;
  title?: string;
  description?: string | null;
  categoryId?: string | null;
  updatedAt: Date;
};

export type ListTaskRecordsInput = {
  userId: string;
  status?: TaskStatus;
  categoryId?: string | null;
  title?: string;
  orderBy?: "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
};

export type RemoveCategoryFromTaskRecordsInput = {
  categoryId: string;
  updatedAt: Date;
};

export type TaskRepository = {
  create: (task: Task) => Promise<Task>;

  existsById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<Task | null>;

  complete: (
    input: CompleteTaskRecordInput,
  ) => Promise<TaskRepositoryMutationResult>;

  reopen: (
    input: ReopenTaskRecordInput,
  ) => Promise<TaskRepositoryMutationResult>;

  update: (
    input: UpdateTaskRecordInput,
  ) => Promise<TaskRepositoryMutationResult>;

  delete: (id: string) => Promise<void>;

  list: (input: ListTaskRecordsInput) => Promise<Task[]>;

  removeCategory: (input: RemoveCategoryFromTaskRecordsInput) => Promise<void>;
};
