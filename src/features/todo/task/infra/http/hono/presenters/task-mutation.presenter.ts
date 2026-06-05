import type { TaskRepositoryMutationResult } from "@todo/task/app/repositories/task-repository";

export type TaskMutationResponse = {
  id: string;
  updatedAt: string;
};

export const taskMutationPresenter = {
  toHttp: ({
    id,
    updatedAt,
  }: TaskRepositoryMutationResult): TaskMutationResponse => ({
    id,
    updatedAt: updatedAt.toISOString(),
  }),
};
