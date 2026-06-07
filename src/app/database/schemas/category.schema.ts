import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("categories_user_id_idx").on(table.userId)],
);
