import { makeTask } from "../domain/task";
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

    return task;
  },

  existsById: async (id) => state.tasks.some((task) => task.id === id),

  complete: async ({ id, updatedAt }) => {
    const taskIndex = state.tasks.findIndex((task) => task.id === id);

    const task = state.tasks[taskIndex];

    if (!task) {
      throw new Error("Task not found");
    }

    state.tasks[taskIndex] = {
      ...task,
      status: "done",
      updatedAt,
    };

    return {
      id,
      updatedAt,
    };
  },

  reopen: async ({ id, updatedAt }) => {
    const taskIndex = state.tasks.findIndex((task) => task.id === id);

    const task = state.tasks[taskIndex];

    if (!task) {
      throw new Error("Task not found");
    }

    state.tasks[taskIndex] = {
      ...task,
      status: "pending",
      updatedAt,
    };

    return {
      id,
      updatedAt,
    };
  },

  update: async ({ id, title, description, categoryId, updatedAt }) => {
    const taskIndex = state.tasks.findIndex((task) => task.id === id);

    const task = state.tasks[taskIndex];

    if (!task) {
      throw new Error("Task not found");
    }

    const updatedTask = makeTask({
      id: task.id,
      userId: task.userId,
      categoryId: categoryId === undefined ? task.categoryId : categoryId,
      title: title ?? task.title,
      description: description === undefined ? task.description : description,
      createdAt: task.createdAt,
      updatedAt,
    });

    state.tasks[taskIndex] = {
      ...updatedTask,
      status: task.status,
    };

    return {
      id,
      updatedAt,
    };
  },
});
