import type { Clock } from "@shared/clock";
import type { IdGenerator } from "@shared/id-generator";

import { makeTask } from "../../domain/task";
import type { Task } from "../../domain/task.schema";
import type { TaskRepository } from "../repositories/task-repository";

type CreateTaskInput = {
  userId: string;
  categoryId?: string | null;
  title: string;
  description?: string | null;
};

type CreateTaskDeps = {
  taskRepository: TaskRepository;
  idGenerator: IdGenerator;
  clock: Clock;
};

export type CreateTask = (input: CreateTaskInput) => Promise<Task>;

export const makeCreateTask = ({
  taskRepository,
  idGenerator,
  clock,
}: CreateTaskDeps): CreateTask => {
  return async (input) => {
    const now = clock.now();

    const task = makeTask({
      id: idGenerator.generate(),
      userId: input.userId,
      categoryId: input.categoryId ?? null,
      title: input.title,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    });

    await taskRepository.create(task);

    return task;
  };
};
