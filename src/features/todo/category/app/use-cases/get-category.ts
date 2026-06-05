import { categoryError } from "../../domain/category.errors";
import type { Category } from "../../domain/category.schema";
import type { CategoryRepository } from "../repositories/category-repository";

type GetCategoryInput = {
  id: string;
  userId: string;
};

type GetCategoryDeps = {
  categoryRepository: CategoryRepository;
};

export type GetCategory = (input: GetCategoryInput) => Promise<Category>;

export const makeGetCategory =
  ({ categoryRepository }: GetCategoryDeps): GetCategory =>
  async ({ id, userId }) => {
    const category = await categoryRepository.findById({
      id,
      userId,
    });

    if (!category) {
      throw categoryError.NotFound();
    }

    return category;
  };
