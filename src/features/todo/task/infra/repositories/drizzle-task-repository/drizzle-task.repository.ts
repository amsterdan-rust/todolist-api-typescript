import { and, asc, desc, eq, isNull, sql, type SQL } from "drizzle-orm";

import type { db } from "@/app/database/db";
import { tasks } from "@/app/database/schemas/task.schema";
import type {
  ListTaskRecordsInput,
  TaskRepository,
  UpdateTaskRecordInput,
} from "@todo/task/app/repositories/task-repository";
import { taskSchema, type Task } from "@todo/task/domain/task.schema";

type Database = typeof db;

type MakeDrizzleTaskRepositoryDeps = {
  db: Database;
};

const makeCategoryIdFilter = (
  categoryId: ListTaskRecordsInput["categoryId"],
): SQL | undefined => {
  if (categoryId === undefined) return undefined;
  if (categoryId === null) return isNull(tasks.categoryId);

  return eq(tasks.categoryId, categoryId);
};

const toTask = (record: typeof tasks.$inferSelect): Task =>
  taskSchema.parse({
    id: record.id,
    userId: record.userId,
    categoryId: record.categoryId,
    title: record.title,
    description: record.description,
    status: record.status,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  });

const getOrderColumn = (orderBy: ListTaskRecordsInput["orderBy"]) => {
  if (orderBy === "updatedAt") return tasks.updatedAt;

  return tasks.createdAt;
};

const makeUpdateSet = ({
  title,
  description,
  categoryId,
  updatedAt,
}: UpdateTaskRecordInput): Partial<typeof tasks.$inferInsert> => ({
  ...(title !== undefined && { title }),
  ...(description !== undefined && { description }),
  ...(categoryId !== undefined && { categoryId }),
  updatedAt: updatedAt.toISOString(),
});

export const makeDrizzleTaskRepository = ({
  db,
}: MakeDrizzleTaskRepositoryDeps): TaskRepository => ({
  create: async (task) => {
    const [createdTask] = await db
      .insert(tasks)
      .values({
        id: task.id,
        userId: task.userId,
        categoryId: task.categoryId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      })
      .returning();

    if (!createdTask) throw new Error("Task was not created");

    return toTask(createdTask);
  },

  existsById: async (id) => {
    const [task] = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    return !!task;
  },

  findById: async (id) => {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    if (!task) return null;

    return toTask(task);
  },

  existsByIdAndUserId: async ({ id, userId }) => {
    const [task] = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);

    return !!task;
  },

  findByIdAndUserId: async ({ id, userId }) => {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);

    if (!task) return null;

    return toTask(task);
  },

  findStatusByIdAndUserId: async ({ id, userId }) => {
    const [task] = await db
      .select({ status: tasks.status })
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);

    return task?.status ?? null;
  },

  complete: async ({ id, userId, updatedAt }) => {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        status: "done",
        updatedAt: updatedAt.toISOString(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning({
        id: tasks.id,
        updatedAt: tasks.updatedAt,
      });

    if (!updatedTask) throw new Error("Task not found");

    return {
      id: updatedTask.id,
      updatedAt: new Date(updatedTask.updatedAt),
    };
  },

  reopen: async ({ id, userId, updatedAt }) => {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        status: "pending",
        updatedAt: updatedAt.toISOString(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning({
        id: tasks.id,
        updatedAt: tasks.updatedAt,
      });

    if (!updatedTask) throw new Error("Task not found");

    return {
      id: updatedTask.id,
      updatedAt: new Date(updatedTask.updatedAt),
    };
  },

  update: async (input) => {
    const [updatedTask] = await db
      .update(tasks)
      .set(makeUpdateSet(input))
      .where(and(eq(tasks.id, input.id), eq(tasks.userId, input.userId)))
      .returning({
        id: tasks.id,
        updatedAt: tasks.updatedAt,
      });

    if (!updatedTask) throw new Error("Task not found");

    return {
      id: updatedTask.id,
      updatedAt: new Date(updatedTask.updatedAt),
    };
  },

  delete: async ({ id, userId }) => {
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  },

  list: async ({
    userId,
    status,
    categoryId,
    title,
    orderBy = "createdAt",
    orderDirection = "desc",
  }) => {
    const categoryIdFilter = makeCategoryIdFilter(categoryId);

    const filters: SQL[] = [
      eq(tasks.userId, userId),
      ...(status !== undefined ? [eq(tasks.status, status)] : []),
      ...(categoryIdFilter ? [categoryIdFilter] : []),
      ...(title !== undefined
        ? [sql`lower(${tasks.title}) like ${`%${title.toLowerCase()}%`}`]
        : []),
    ];

    const orderColumn = getOrderColumn(orderBy);
    const order =
      orderDirection === "asc" ? asc(orderColumn) : desc(orderColumn);

    const taskRecords = await db
      .select()
      .from(tasks)
      .where(and(...filters))
      .orderBy(order);

    return taskRecords.map(toTask);
  },

  removeCategory: async ({ categoryId, userId, updatedAt }) => {
    await db
      .update(tasks)
      .set({
        categoryId: null,
        updatedAt: updatedAt.toISOString(),
      })
      .where(and(eq(tasks.categoryId, categoryId), eq(tasks.userId, userId)));
  },
});
