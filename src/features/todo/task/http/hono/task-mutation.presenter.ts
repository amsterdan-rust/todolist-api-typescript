import type { TaskRepositoryMutationResult } from "@todo/task/ports/task-repository";

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
