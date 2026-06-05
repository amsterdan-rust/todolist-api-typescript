import type { Clock } from "@shared/clock";

import { taskError } from "../../domain/task.errors";
import type {
  TaskRepository,
  TaskRepositoryMutationResult,
} from "../repositories/task-repository";

type UpdateTaskInput = {
  id: string;
  userId: string;
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
  async ({ id, userId, title, description, categoryId }) => {
    const taskExists = await taskRepository.existsByIdAndUserId({
      id,
      userId,
    });

    if (!taskExists) {
      throw taskError.NotFound();
    }

    return taskRepository.update({
      id,
      userId,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
      updatedAt: clock.now(),
    });
  };
