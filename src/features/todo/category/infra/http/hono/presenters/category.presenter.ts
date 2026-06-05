import type { Category } from "@todo/category/domain/category.schema";

import type { CategoryResponse } from "../responses/category-response.schema";

export const categoryPresenter = {
  toHttp: (category: Category): CategoryResponse => ({
    id: category.id,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }),
};
