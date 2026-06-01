import type { Category } from "../domain/category.schema";

export type CategoryMutationResult = {
  id: string;
  updatedAt: Date;
};

export type UpdateCategoryInput = {
  id: string;
  name: string;
  updatedAt: Date;
};

export type ListCategoriesInput = {
  userId: string;
  name?: string;
};

export type CategoryRepository = {
  create: (category: Category) => Promise<Category>;

  existsById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<Category | null>;

  update: (input: UpdateCategoryInput) => Promise<CategoryMutationResult>;

  delete: (id: string) => Promise<void>;

  list: (input: ListCategoriesInput) => Promise<Category[]>;
};
