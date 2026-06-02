import type { Clock } from "@shared/clock";

import { taskError } from "../domain/task.errors";
import type {
  TaskRepositoryMutationResult,
  TaskRepository,
} from "../ports/task-repository";

type CompleteTaskInput = {
  id: string;
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
  async ({ id }) => {
    const taskExists = await taskRepository.existsById(id);

    if (!taskExists) {
      throw taskError.NotFound();
    }

    return taskRepository.complete({
      id,
      updatedAt: clock.now(),
    });
  };
