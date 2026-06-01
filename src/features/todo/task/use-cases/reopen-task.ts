import type { Clock } from "@shared/clock";

import { taskError } from "../domain/task.errors";
import type {
  TaskMutationResult,
  TaskRepository,
} from "../ports/task-repository";

type ReopenTaskInput = {
  id: string;
};

type ReopenTaskDeps = {
  taskRepository: TaskRepository;
  clock: Clock;
};

export type ReopenTask = (
  input: ReopenTaskInput,
) => Promise<TaskMutationResult>;

export const makeReopenTask =
  ({ taskRepository, clock }: ReopenTaskDeps): ReopenTask =>
  async ({ id }) => {
    const taskExists = await taskRepository.existsById(id);

    if (!taskExists) {
      throw taskError.NotFound();
    }

    return taskRepository.reopen({
      id,
      updatedAt: clock.now(),
    });
  };
