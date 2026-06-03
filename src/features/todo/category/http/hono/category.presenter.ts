import type { Category } from "@todo/category/domain/category.schema";

import type { CategoryResponse } from "./category-response.schema";

export const categoryPresenter = {
  toHttp: (category: Category): CategoryResponse => ({
    id: category.id,
    userId: category.userId,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }),
};
