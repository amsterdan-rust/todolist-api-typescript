import type { Clock } from "@shared/clock";

import { taskError } from "../../domain/task.errors";
import type {
  TaskRepository,
  TaskRepositoryMutationResult,
} from "../repositories/task-repository";

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
    const status = await taskRepository.findStatusByIdAndUserId({
      id,
      userId,
    });

    if (!status) throw taskError.NotFound();
    if (status === "pending") throw taskError.AlreadyPending();

    return taskRepository.reopen({
      id,
      userId,
      updatedAt: clock.now(),
    });
  };
