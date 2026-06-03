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

  findById: async (id) => state.tasks.find((task) => task.id === id) ?? null,

  existsByIdAndUserId: async ({ id, userId }) =>
    state.tasks.some((task) => task.id === id && task.userId === userId),

  findByIdAndUserId: async ({ id, userId }) =>
    state.tasks.find((task) => task.id === id && task.userId === userId) ??
    null,

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

  update: async ({ id, userId, title, description, categoryId, updatedAt }) => {
    const taskIndex = state.tasks.findIndex(
      (task) => task.id === id && task.userId === userId,
    );

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

  delete: async (id) => {
    const taskIndex = state.tasks.findIndex((task) => task.id === id);

    if (taskIndex >= 0) {
      state.tasks.splice(taskIndex, 1);
    }
  },

  list: async ({
    userId,
    status,
    categoryId,
    title,
    orderBy = "createdAt",
    orderDirection = "desc",
  }) => {
    const filteredTasks = state.tasks.filter((task) => {
      const matchesUserId = task.userId === userId;
      const matchesStatus = status === undefined || task.status === status;
      const matchesCategoryId =
        categoryId === undefined || task.categoryId === categoryId;
      const matchesTitle =
        title === undefined ||
        task.title.toLowerCase().includes(title.toLowerCase());

      return (
        matchesUserId && matchesStatus && matchesCategoryId && matchesTitle
      );
    });

    return filteredTasks.toSorted((currentTask, nextTask) => {
      const currentDate = currentTask[orderBy].getTime();
      const nextDate = nextTask[orderBy].getTime();

      if (orderDirection === "asc") {
        return currentDate - nextDate;
      }

      return nextDate - currentDate;
    });
  },

  removeCategory: async ({ categoryId, updatedAt }) => {
    state.tasks.forEach((task, index) => {
      if (task.categoryId !== categoryId) {
        return;
      }

      state.tasks[index] = {
        ...task,
        categoryId: null,
        updatedAt,
      };
    });
  },
});
