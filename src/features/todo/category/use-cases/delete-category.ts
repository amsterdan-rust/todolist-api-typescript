import type { Clock } from "@shared/clock";

import { categoryError } from "../domain/category.errors";
import type { CategoryRepository } from "../ports/category-repository";
import type { TaskRepository } from "../../task/ports/task-repository";

type DeleteCategoryInput = {
  id: string;
  userId: string;
};

type DeleteCategoryDeps = {
  categoryRepository: CategoryRepository;
  taskRepository: TaskRepository;
  clock: Clock;
};

export type DeleteCategory = (input: DeleteCategoryInput) => Promise<void>;

export const makeDeleteCategory =
  ({
    categoryRepository,
    taskRepository,
    clock,
  }: DeleteCategoryDeps): DeleteCategory =>
  async ({ id, userId }) => {
    const categoryExists = await categoryRepository.existsById({
      id,
      userId,
    });

    if (!categoryExists) {
      throw categoryError.NotFound();
    }

    await taskRepository.removeCategory({
      categoryId: id,
      userId,
      updatedAt: clock.now(),
    });

    await categoryRepository.delete({
      id,
      userId,
    });
  };
