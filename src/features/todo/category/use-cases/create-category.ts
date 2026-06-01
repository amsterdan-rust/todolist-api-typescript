import type { Clock } from "@shared/clock";
import type { IdGenerator } from "@shared/id-generator";

import { makeCategory } from "../domain/category";
import type { Category } from "../domain/category.schema";
import type { CategoryRepository } from "../ports/category-repository";

type CreateCategoryInput = {
  userId: string;
  name: string;
};

type CreateCategoryDeps = {
  categoryRepository: CategoryRepository;
  idGenerator: IdGenerator;
  clock: Clock;
};

export type CreateCategory = (input: CreateCategoryInput) => Promise<Category>;

export const makeCreateCategory =
  ({
    categoryRepository,
    idGenerator,
    clock,
  }: CreateCategoryDeps): CreateCategory =>
  async ({ userId, name }) => {
    const now = clock.now();

    const category = makeCategory({
      id: idGenerator.generate(),
      userId,
      name,
      createdAt: now,
      updatedAt: now,
    });

    return categoryRepository.create(category);
  };
