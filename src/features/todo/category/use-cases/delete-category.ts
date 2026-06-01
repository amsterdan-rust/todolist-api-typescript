import type { Clock } from "@shared/clock";

import { categoryError } from "../domain/category.errors";
import type { CategoryRepository } from "../ports/category-repository";
import type { TaskRepository } from "../../task/ports/task-repository";

type DeleteCategoryInput = {
  id: string;
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
  async ({ id }) => {
    const categoryExists = await categoryRepository.existsById(id);

    if (!categoryExists) {
      throw categoryError.NotFound();
    }

    await taskRepository.removeCategory({
      categoryId: id,
      updatedAt: clock.now(),
    });

    await categoryRepository.delete(id);
  };
