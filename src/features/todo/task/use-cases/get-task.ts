import { taskError } from "../domain/task.errors";
import type { Task } from "../domain/task.schema";
import type { TaskRepository } from "../ports/task-repository";

type GetTaskInput = {
  id: string;
};

type GetTaskDeps = {
  taskRepository: TaskRepository;
};

export type GetTask = (input: GetTaskInput) => Promise<Task>;

export const makeGetTask =
  ({ taskRepository }: GetTaskDeps): GetTask =>
  async ({ id }) => {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw taskError.NotFound();
    }

    return task;
  };
