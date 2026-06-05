import { taskError } from "../../domain/task.errors";
import type { TaskRepository } from "../repositories/task-repository";

type DeleteTaskInput = {
  id: string;
  userId: string;
};

type DeleteTaskDeps = {
  taskRepository: TaskRepository;
};

export type DeleteTask = (input: DeleteTaskInput) => Promise<void>;

export const makeDeleteTask =
  ({ taskRepository }: DeleteTaskDeps): DeleteTask =>
  async ({ id, userId }) => {
    const taskExists = await taskRepository.existsByIdAndUserId({
      id,
      userId,
    });

    if (!taskExists) {
      throw taskError.NotFound();
    }

    await taskRepository.delete({
      id,
      userId,
    });
  };
