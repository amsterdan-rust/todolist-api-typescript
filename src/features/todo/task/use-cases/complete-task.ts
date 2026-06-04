import type { Clock } from "@shared/clock";

import { taskError } from "../domain/task.errors";
import type {
  TaskRepository,
  TaskRepositoryMutationResult,
} from "../ports/task-repository";

type CompleteTaskInput = {
  id: string;
  userId: string;
};

type CompleteTaskDeps = {
  taskRepository: TaskRepository;
  clock: Clock;
};

export type CompleteTask = (
  input: CompleteTaskInput,
) => Promise<TaskRepositoryMutationResult>;

export const makeCompleteTask =
  ({ taskRepository, clock }: CompleteTaskDeps): CompleteTask =>
  async ({ id, userId }) => {
    const status = await taskRepository.findStatusByIdAndUserId({
      id,
      userId,
    });

    if (!status) throw taskError.NotFound();
    if (status === "done") throw taskError.AlreadyCompleted();

    return taskRepository.complete({
      id,
      userId,
      updatedAt: clock.now(),
    });
  };
