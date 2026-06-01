import { categoryError } from "../domain/category.errors";
import type { Category } from "../domain/category.schema";
import type { CategoryRepository } from "../ports/category-repository";

type GetCategoryInput = {
  id: string;
};

type GetCategoryDeps = {
  categoryRepository: CategoryRepository;
};

export type GetCategory = (input: GetCategoryInput) => Promise<Category>;

export const makeGetCategory =
  ({ categoryRepository }: GetCategoryDeps): GetCategory =>
  async ({ id }) => {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw categoryError.NotFound();
    }

    return category;
  };
