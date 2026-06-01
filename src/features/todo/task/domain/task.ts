import { taskSchema, type Task } from "./task.schema";

type MakeTaskInput = {
  id: string;
  userId: string;
  categoryId?: string | null;
  title: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const makeTask = (input: MakeTaskInput): Task => {
  return taskSchema.parse({
    id: input.id,
    userId: input.userId,
    categoryId: input.categoryId ?? null,
    title: input.title,
    description: input.description ?? null,
    status: "pending",
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  });
};
