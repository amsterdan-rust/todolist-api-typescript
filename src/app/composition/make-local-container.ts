import { db } from "@app/database/local/db";
import { makeContainer } from "@app/container";
import { makeDrizzleCategoryRepository } from "@todo/category/infra/repositories/drizzle-category-repository/drizzle-category.repository";
import { makeDrizzleTaskRepository } from "@todo/task/infra/repositories/drizzle-task-repository/drizzle-task.repository";

export const makeProductionContainer = () =>
  makeContainer({
    taskRepository: makeDrizzleTaskRepository({
      db,
    }),
    categoryRepository: makeDrizzleCategoryRepository({
      db,
    }),
  });
