import type { CategoryRepositoryMutationResult } from "@todo/category/app/repositories/category-repository";

import type { CategoryMutationResponse } from "./category-mutation-response.schema";

export const categoryMutationPresenter = {
  toHttp: ({
    id,
    updatedAt,
  }: CategoryRepositoryMutationResult): CategoryMutationResponse => ({
    id,
    updatedAt: updatedAt.toISOString(),
  }),
};
