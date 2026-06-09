import type { makeD1Database } from "@app/database/worker/d1";
import { makeDrizzleCategoryRepository } from "@todo/category/infra/repositories/drizzle-category-repository/drizzle-category.repository";
import { makeDrizzleTaskRepository } from "@todo/task/infra/repositories/drizzle-task-repository/drizzle-task.repository";

import { makeAppContainer } from "./make-app-container";

type WorkerDatabase = ReturnType<typeof makeD1Database>;

type MakeWorkerContainerDeps = {
  db: WorkerDatabase;
};

export const makeWorkerContainer = ({ db }: MakeWorkerContainerDeps) =>
  makeAppContainer({
    taskRepository: makeDrizzleTaskRepository({
      db,
    }),
    categoryRepository: makeDrizzleCategoryRepository({
      db,
    }),
  });
