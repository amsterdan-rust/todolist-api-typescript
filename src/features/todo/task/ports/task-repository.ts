import type { Task } from "../domain/task.schema";

export type TaskRepository = {
  create: (task: Task) => Promise<void>;
};
