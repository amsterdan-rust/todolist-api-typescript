import type { Category } from "../domain/category.schema";

export type CategoryRepository = {
  create: (category: Category) => Promise<Category>;
};
