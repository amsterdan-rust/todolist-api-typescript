import { taskError } from "../domain/task.errors";
import type { TaskRepository } from "../ports/task-repository";

type DeleteTaskInput = {
  id: string;
};

type DeleteTaskDeps = {
  taskRepository: TaskRepository;
};

export type DeleteTask = (input: DeleteTaskInput) => Promise<void>;

export const makeDeleteTask =
  ({ taskRepository }: DeleteTaskDeps): DeleteTask =>
  async ({ id }) => {
    const taskExists = await taskRepository.existsById(id);

    if (!taskExists) {
      throw taskError.NotFound();
    }

    await taskRepository.delete(id);
  };
