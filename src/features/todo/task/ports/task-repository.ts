import type { Task } from "../domain/task.schema";

export type TaskRepository = {
  create: (task: Task) => Promise<void>;
  findById: (id: string) => Promise<Task | null>;
  save: (task: Task) => Promise<void>;
};
