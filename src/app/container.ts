import { makeCryptoIdGenerator } from "@shared/id-generator";
import { makeSystemClock } from "@shared/clock";

import { makeInMemoryTaskRepository } from "@todo/task/infra/in-memory-task-repository";
import { makeCreateTask } from "@todo/task/use-cases/create-task";
import { makeCompleteTask } from "@todo/task/use-cases/complete-task";
import { makeReopenTask } from "@todo/task/use-cases/reopen-task";
import { makeUpdateTask } from "@todo/task/use-cases/update-task";
import { makeDeleteTask } from "@todo/task/use-cases/delete-task";
import { makeListTasks } from "@todo/task/use-cases/list-tasks";
import { makeGetTask } from "@todo/task/use-cases/get-task";

import { makeInMemoryCategoryRepository } from "@todo/category/infra/in-memory-category-repository";
import { makeCreateCategory } from "@todo/category/use-cases/create-category";
import { makeUpdateCategory } from "@todo/category/use-cases/update-category";
import { makeDeleteCategory } from "@todo/category/use-cases/delete-category";
import { makeListCategories } from "@todo/category/use-cases/list-categories";
import { makeGetCategory } from "@todo/category/use-cases/get-category";

export const makeContainer = () => {
  const clock = makeSystemClock();
  const idGenerator = makeCryptoIdGenerator();

  const taskRepository = makeInMemoryTaskRepository();
  const categoryRepository = makeInMemoryCategoryRepository();

  return {
    repositories: {
      taskRepository,
      categoryRepository,
    },

    taskUseCases: {
      createTask: makeCreateTask({
        taskRepository,
        idGenerator,
        clock,
      }),

      completeTask: makeCompleteTask({
        taskRepository,
        clock,
      }),

      reopenTask: makeReopenTask({
        taskRepository,
        clock,
      }),

      updateTask: makeUpdateTask({
        taskRepository,
        clock,
      }),

      deleteTask: makeDeleteTask({
        taskRepository,
      }),

      listTasks: makeListTasks({
        taskRepository,
      }),

      getTask: makeGetTask({
        taskRepository,
      }),
    },

    categoryUseCases: {
      createCategory: makeCreateCategory({
        categoryRepository,
        idGenerator,
        clock,
      }),

      updateCategory: makeUpdateCategory({
        categoryRepository,
        clock,
      }),

      deleteCategory: makeDeleteCategory({
        categoryRepository,
        taskRepository,
        clock,
      }),

      listCategories: makeListCategories({
        categoryRepository,
      }),

      getCategory: makeGetCategory({
        categoryRepository,
      }),
    },
  };
};
