import type { Clock } from "@shared/clock";

import { categoryError } from "../../domain/category.errors";
import type {
  CategoryRepositoryMutationResult,
  CategoryRepository,
} from "../repositories/category-repository";

type UpdateCategoryInput = {
  id: string;
  userId: string;
  name: string;
};

type UpdateCategoryDeps = {
  categoryRepository: CategoryRepository;
  clock: Clock;
};

export type UpdateCategory = (
  input: UpdateCategoryInput,
) => Promise<CategoryRepositoryMutationResult>;

export const makeUpdateCategory =
  ({ categoryRepository, clock }: UpdateCategoryDeps): UpdateCategory =>
  async ({ id, userId, name }) => {
    const categoryExists = await categoryRepository.existsById({
      id,
      userId,
    });

    if (!categoryExists) {
      throw categoryError.NotFound();
    }

    return categoryRepository.update({
      id,
      userId,
      name,
      updatedAt: clock.now(),
    });
  };
