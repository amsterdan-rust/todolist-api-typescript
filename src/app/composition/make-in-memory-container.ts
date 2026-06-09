import { makeInMemoryCategoryRepository } from "@todo/category/infra/repositories/in-memory-category-repository";
import { makeInMemoryTaskRepository } from "@todo/task/infra/repositories/in-memory-task-repository";

import { makeAppContainer } from "./make-app-container";

export const makeInMemoryContainer = () =>
  makeAppContainer({
    taskRepository: makeInMemoryTaskRepository(),
    categoryRepository: makeInMemoryCategoryRepository(),
  });
