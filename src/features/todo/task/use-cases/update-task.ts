import type { Clock } from "@shared/clock";

import { makeTask } from "../domain/task";
import { taskError } from "../domain/task.errors";
import type { Task } from "../domain/task.schema";
import type { TaskRepository } from "../ports/task-repository";

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

export type UpdateTask = (input: UpdateTaskInput) => Promise<Task>;

export const makeUpdateTask =
  ({ taskRepository, clock }: UpdateTaskDeps): UpdateTask =>
  async ({ id, title, description, categoryId }) => {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw taskError.NotFound();
    }

    const updatedTask = makeTask({
      id: task.id,
      userId: task.userId,
      categoryId: categoryId === undefined ? task.categoryId : categoryId,
      title: title ?? task.title,
      description: description === undefined ? task.description : description,
      createdAt: task.createdAt,
      updatedAt: clock.now(),
    });

    const taskWithCurrentStatus: Task = {
      ...updatedTask,
      status: task.status,
    };

    await taskRepository.save(taskWithCurrentStatus);

    return taskWithCurrentStatus;
  };
