import { db } from "@app/database/local/db";
import { makeAppContainer } from "./make-app-container";
import { makeDrizzleCategoryRepository } from "@todo/category/infra/repositories/drizzle-category-repository/drizzle-category.repository";
import { makeDrizzleTaskRepository } from "@todo/task/infra/repositories/drizzle-task-repository/drizzle-task.repository";

export const makeLocalContainer = () =>
  makeAppContainer({
    taskRepository: makeDrizzleTaskRepository({
      db,
    }),
    categoryRepository: makeDrizzleCategoryRepository({
      db,
    }),
  });
