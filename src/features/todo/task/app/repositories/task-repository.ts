import type { Task, TaskStatus } from "../../domain/task.schema";

export type TaskRepositoryMutationResult = {
  id: string;
  updatedAt: Date;
};

export type CompleteTaskRecordInput = {
  id: string;
  userId: string;
  updatedAt: Date;
};

export type ReopenTaskRecordInput = {
  id: string;
  userId: string;
  updatedAt: Date;
};

export type UpdateTaskRecordInput = {
  id: string;
  userId: string;
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
  userId: string;
  updatedAt: Date;
};

export type FindTaskRecordInput = {
  id: string;
  userId: string;
};

export type DeleteTaskRecordInput = {
  id: string;
  userId: string;
};

export type TaskRepository = {
  create: (task: Task) => Promise<Task>;

  existsById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<Task | null>;

  existsByIdAndUserId: (input: FindTaskRecordInput) => Promise<boolean>;
  findByIdAndUserId: (input: FindTaskRecordInput) => Promise<Task | null>;
  findStatusByIdAndUserId: (
    input: FindTaskRecordInput,
  ) => Promise<TaskStatus | null>;

  complete: (
    input: CompleteTaskRecordInput,
  ) => Promise<TaskRepositoryMutationResult>;

  reopen: (
    input: ReopenTaskRecordInput,
  ) => Promise<TaskRepositoryMutationResult>;

  update: (
    input: UpdateTaskRecordInput,
  ) => Promise<TaskRepositoryMutationResult>;

  delete: (input: DeleteTaskRecordInput) => Promise<void>;

  list: (input: ListTaskRecordsInput) => Promise<Task[]>;

  removeCategory: (input: RemoveCategoryFromTaskRecordsInput) => Promise<void>;
};
