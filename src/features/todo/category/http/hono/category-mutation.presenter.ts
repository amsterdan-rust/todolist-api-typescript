import type { CategoryRepositoryMutationResult } from "@todo/category/ports/category-repository";

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
