import { makeCategory } from "../../domain/category";
import type { Category } from "../../domain/category.schema";
import type { CategoryRepository } from "../../app/repositories/category-repository";

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

  existsById: async ({ id, userId }) =>
    state.categories.some(
      (category) => category.id === id && category.userId === userId,
    ),

  findById: async ({ id, userId }) =>
    state.categories.find(
      (category) => category.id === id && category.userId === userId,
    ) ?? null,

  update: async ({ id, userId, name, updatedAt }) => {
    const categoryIndex = state.categories.findIndex(
      (category) => category.id === id && category.userId === userId,
    );

    const category = state.categories[categoryIndex];

    if (!category) {
      throw new Error("Category not found");
    }

    const updatedCategory = makeCategory({
      ...category,
      name,
      updatedAt,
    });

    state.categories[categoryIndex] = updatedCategory;

    return {
      id,
      updatedAt,
    };
  },

  delete: async ({ id, userId }) => {
    const categoryIndex = state.categories.findIndex(
      (category) => category.id === id && category.userId === userId,
    );

    if (categoryIndex >= 0) {
      state.categories.splice(categoryIndex, 1);
    }
  },

  list: async ({ userId, name }) =>
    state.categories.filter((category) => {
      const matchesUserId = category.userId === userId;
      const matchesName =
        name === undefined ||
        category.name.toLowerCase().includes(name.toLowerCase());

      return matchesUserId && matchesName;
    }),
});
