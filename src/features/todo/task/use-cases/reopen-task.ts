import type { Clock } from "@shared/clock";

import { taskError } from "../domain/task.errors";
import type { Task } from "../domain/task.schema";
import type { TaskRepository } from "../ports/task-repository";

type ReopenTaskInput = {
  id: string;
};

type ReopenTaskDeps = {
  taskRepository: TaskRepository;
  clock: Clock;
};

export type ReopenTask = (input: ReopenTaskInput) => Promise<Task>;

export const makeReopenTask =
  ({ taskRepository, clock }: ReopenTaskDeps): ReopenTask =>
  async ({ id }) => {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw taskError.NotFound();
    }

    const now = clock.now();

    const reopenedTask: Task = {
      ...task,
      status: "pending",
      updatedAt: now,
    };

    await taskRepository.save(reopenedTask);

    return reopenedTask;
  };
