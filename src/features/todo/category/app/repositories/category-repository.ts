import type { Category } from "../domain/category.schema";

export type CategoryRepositoryMutationResult = {
  id: string;
  updatedAt: Date;
};

export type CategoryRecordIdentityInput = {
  id: string;
  userId: string;
};

export type UpdateCategoryRecordInput = CategoryRecordIdentityInput & {
  name: string;
  updatedAt: Date;
};

export type ListCategoryRecordsInput = {
  userId: string;
  name?: string;
};

export type CategoryRepository = {
  create: (category: Category) => Promise<Category>;

  existsById: (input: CategoryRecordIdentityInput) => Promise<boolean>;
  findById: (input: CategoryRecordIdentityInput) => Promise<Category | null>;

  update: (
    input: UpdateCategoryRecordInput,
  ) => Promise<CategoryRepositoryMutationResult>;

  delete: (input: CategoryRecordIdentityInput) => Promise<void>;

  list: (input: ListCategoryRecordsInput) => Promise<Category[]>;
};
