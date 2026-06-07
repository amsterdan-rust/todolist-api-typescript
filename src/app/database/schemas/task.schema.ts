import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";
import { categories } from "./category.schema";

export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", {
      enum: ["pending", "done"],
    }).notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("tasks_user_id_idx").on(table.userId),
    index("tasks_category_id_idx").on(table.categoryId),
    index("tasks_status_idx").on(table.status),
  ],
);
