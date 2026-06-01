import type { Task } from "../domain/task.schema";
import type { TaskRepository } from "../ports/task-repository";

type InMemoryTaskRepositoryState = {
  tasks: Task[];
};

export type InMemoryTaskRepository = TaskRepository & {
  items: Task[];
};

export const makeInMemoryTaskRepository = (
  state: InMemoryTaskRepositoryState = { tasks: [] },
): InMemoryTaskRepository => ({
  items: state.tasks,

  create: async (task) => {
    state.tasks.push(task);
  },
});
