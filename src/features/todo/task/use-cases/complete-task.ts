import type { Clock } from "@shared/clock";

import { taskError } from "../domain/task.errors";
import type { Task } from "../domain/task.schema";
import type { TaskRepository } from "../ports/task-repository";

type CompleteTaskInput = {
  id: string;
};

type CompleteTaskDeps = {
  taskRepository: TaskRepository;
  clock: Clock;
};

export type CompleteTask = (input: CompleteTaskInput) => Promise<Task>;

export const makeCompleteTask =
  ({ taskRepository, clock }: CompleteTaskDeps): CompleteTask =>
  async ({ id }) => {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw taskError.NotFound();
    }

    const now = clock.now();

    const completedTask: Task = {
      ...task,
      status: "done",
      updatedAt: now,
    };

    await taskRepository.save(completedTask);

    return completedTask;
  };
