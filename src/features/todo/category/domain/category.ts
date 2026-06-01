import { categorySchema, type Category } from "./category.schema";

type MakeCategoryInput = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export const makeCategory = (input: MakeCategoryInput): Category =>
  categorySchema.parse(input);
