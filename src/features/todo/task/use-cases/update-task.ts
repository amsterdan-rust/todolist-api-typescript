import type { Clock } from "@shared/clock";

import { taskError } from "../domain/task.errors";
import type {
  TaskRepositoryMutationResult,
  TaskRepository,
} from "../ports/task-repository";

type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string | null;
  categoryId?: string | null;
};

type UpdateTaskDeps = {
  taskRepository: TaskRepository;
  clock: Clock;
};

export type UpdateTask = (
  input: UpdateTaskInput,
) => Promise<TaskRepositoryMutationResult>;

export const makeUpdateTask =
  ({ taskRepository, clock }: UpdateTaskDeps): UpdateTask =>
  async ({ id, title, description, categoryId }) => {
    const taskExists = await taskRepository.existsById(id);

    if (!taskExists) {
      throw taskError.NotFound();
    }

    return taskRepository.update({
      id,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
      updatedAt: clock.now(),
    });
  };
