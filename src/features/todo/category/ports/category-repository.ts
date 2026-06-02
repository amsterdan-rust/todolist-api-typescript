import type { Category } from "../domain/category.schema";

export type CategoryRepositoryMutationResult = {
  id: string;
  updatedAt: Date;
};

export type UpdateCategoryRecordInput = {
  id: string;
  name: string;
  updatedAt: Date;
};

export type ListCategoryRecordsInput = {
  userId: string;
  name?: string;
};

export type CategoryRepository = {
  create: (category: Category) => Promise<Category>;

  existsById: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<Category | null>;

  update: (
    input: UpdateCategoryRecordInput,
  ) => Promise<CategoryRepositoryMutationResult>;

  delete: (id: string) => Promise<void>;

  list: (input: ListCategoryRecordsInput) => Promise<Category[]>;
};
