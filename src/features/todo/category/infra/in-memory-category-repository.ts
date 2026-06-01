import type { Category } from "../domain/category.schema";
import type { CategoryRepository } from "../ports/category-repository";

type InMemoryCategoryRepositoryState = {
  categories: Category[];
};

export type InMemoryCategoryRepository = CategoryRepository & {
  items: Category[];
};

export const makeInMemoryCategoryRepository = (
  state: InMemoryCategoryRepositoryState = { categories: [] },
): InMemoryCategoryRepository => ({
  items: state.categories,

  create: async (category) => {
    state.categories.push(category);

    return category;
  },
});
