import { makeCryptoIdGenerator } from "@shared/id-generator";
import { makeSystemClock } from "@shared/clock";

import type { TaskRepository } from "@todo/task/app/repositories/task-repository";
import { makeInMemoryTaskRepository } from "@todo/task/infra/repositories/in-memory-task-repository";
import { makeCreateTask } from "@todo/task/app/use-cases/create-task";
import { makeCompleteTask } from "@todo/task/app/use-cases/complete-task";
import { makeReopenTask } from "@todo/task/app/use-cases/reopen-task";
import { makeUpdateTask } from "@todo/task/app/use-cases/update-task";
import { makeDeleteTask } from "@todo/task/app/use-cases/delete-task";
import { makeListTasks } from "@todo/task/app/use-cases/list-tasks";
import { makeGetTask } from "@todo/task/app/use-cases/get-task";

import type { CategoryRepository } from "@todo/category/app/repositories/category-repository";
import { makeInMemoryCategoryRepository } from "@todo/category/infra/repositories/in-memory-category-repository";
import { makeCreateCategory } from "@todo/category/app/use-cases/create-category";
import { makeUpdateCategory } from "@todo/category/app/use-cases/update-category";
import { makeDeleteCategory } from "@todo/category/app/use-cases/delete-category";
import { makeListCategories } from "@todo/category/app/use-cases/list-categories";
import { makeGetCategory } from "@todo/category/app/use-cases/get-category";

type MakeContainerDeps = {
  taskRepository?: TaskRepository;
  categoryRepository?: CategoryRepository;
};

export const makeContainer = ({
  taskRepository = makeInMemoryTaskRepository(),
  categoryRepository = makeInMemoryCategoryRepository(),
}: MakeContainerDeps = {}) => {
  const clock = makeSystemClock();
  const idGenerator = makeCryptoIdGenerator();

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

export type AppContainer = ReturnType<typeof makeContainer>;
