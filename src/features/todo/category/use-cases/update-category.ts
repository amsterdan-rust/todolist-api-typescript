import type { Clock } from "@shared/clock";

import { categoryError } from "../domain/category.errors";
import type {
  CategoryMutationResult,
  CategoryRepository,
} from "../ports/category-repository";

type UpdateCategoryInput = {
  id: string;
  name: string;
};

type UpdateCategoryDeps = {
  categoryRepository: CategoryRepository;
  clock: Clock;
};

export type UpdateCategory = (
  input: UpdateCategoryInput,
) => Promise<CategoryMutationResult>;

export const makeUpdateCategory =
  ({ categoryRepository, clock }: UpdateCategoryDeps): UpdateCategory =>
  async ({ id, name }) => {
    const categoryExists = await categoryRepository.existsById(id);

    if (!categoryExists) {
      throw categoryError.NotFound();
    }

    return categoryRepository.update({
      id,
      name,
      updatedAt: clock.now(),
    });
  };
