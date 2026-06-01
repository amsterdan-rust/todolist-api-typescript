import type { Category } from "../domain/category.schema";
import type { CategoryRepository } from "../ports/category-repository";

type ListCategoriesInput = {
  userId: string;
  name?: string;
};

type ListCategoriesDeps = {
  categoryRepository: CategoryRepository;
};

export type ListCategories = (
  input: ListCategoriesInput,
) => Promise<Category[]>;

export const makeListCategories =
  ({ categoryRepository }: ListCategoriesDeps): ListCategories =>
  async (input) =>
    categoryRepository.list(input);
