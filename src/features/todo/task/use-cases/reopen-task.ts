import type { Clock } from "@shared/clock";

import { taskError } from "../domain/task.errors";
import type {
  TaskRepository,
  TaskRepositoryMutationResult,
} from "../ports/task-repository";

type ReopenTaskInput = {
  id: string;
  userId: string;
};

type ReopenTaskDeps = {
  taskRepository: TaskRepository;
  clock: Clock;
};

export type ReopenTask = (
  input: ReopenTaskInput,
) => Promise<TaskRepositoryMutationResult>;

export const makeReopenTask =
  ({ taskRepository, clock }: ReopenTaskDeps): ReopenTask =>
  async ({ id, userId }) => {
    const taskExists = await taskRepository.existsByIdAndUserId({
      id,
      userId,
    });

    if (!taskExists) {
      throw taskError.NotFound();
    }

    return taskRepository.reopen({
      id,
      userId,
      updatedAt: clock.now(),
    });
  };
