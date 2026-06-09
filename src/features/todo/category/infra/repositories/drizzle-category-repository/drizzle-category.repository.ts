// src/features/todo/category/infra/repositories/drizzle-category-repository/drizzle-category.repository.ts
import { and, eq, sql } from "drizzle-orm";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

import type * as databaseSchema from "@app/database/schema";
import { categories } from "@app/database/schemas/category.schema";
import type {
  CategoryRepository,
  ListCategoryRecordsInput,
} from "@todo/category/app/repositories/category-repository";
import { makeCategory } from "@todo/category/domain/category";
import type { Category } from "@todo/category/domain/category.schema";

type Database = BaseSQLiteDatabase<
  "sync" | "async",
  any,
  typeof databaseSchema
>;

type MakeDrizzleCategoryRepositoryDeps = {
  db: Database;
};

const toCategory = (record: typeof categories.$inferSelect): Category =>
  makeCategory({
    id: record.id,
    userId: record.userId,
    name: record.name,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  });

export const makeDrizzleCategoryRepository = ({
  db,
}: MakeDrizzleCategoryRepositoryDeps): CategoryRepository => ({
  create: async (category) => {
    const [createdCategory] = await db
      .insert(categories)
      .values({
        id: category.id,
        userId: category.userId,
        name: category.name,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      })
      .returning();

    if (!createdCategory) throw new Error("Category was not created");

    return toCategory(createdCategory);
  },

  existsById: async ({ id, userId }) => {
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .limit(1);

    return !!category;
  },

  findById: async ({ id, userId }) => {
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .limit(1);

    if (!category) return null;

    return toCategory(category);
  },

  update: async ({ id, userId, name, updatedAt }) => {
    const [updatedCategory] = await db
      .update(categories)
      .set({
        name,
        updatedAt: updatedAt.toISOString(),
      })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning({
        id: categories.id,
        updatedAt: categories.updatedAt,
      });

    if (!updatedCategory) throw new Error("Category not found");

    return {
      id: updatedCategory.id,
      updatedAt: new Date(updatedCategory.updatedAt),
    };
  },

  delete: async ({ id, userId }) => {
    await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
  },

  list: async ({ userId, name }: ListCategoryRecordsInput) => {
    const filters = [
      eq(categories.userId, userId),
      name
        ? sql`lower(${categories.name}) like ${`%${name.toLowerCase()}%`}`
        : undefined,
    ].filter(Boolean);

    const categoryRecords = await db
      .select()
      .from(categories)
      .where(and(...filters));

    return categoryRecords.map(toCategory);
  },
});
