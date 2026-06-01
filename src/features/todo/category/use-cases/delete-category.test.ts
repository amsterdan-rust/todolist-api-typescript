import { describe, expect, it } from "bun:test";

import { makeTask } from "../../task/domain/task";
import { makeInMemoryTaskRepository } from "../../task/infra/in-memory-task-repository";
import { makeCategory } from "../domain/category";
import { makeInMemoryCategoryRepository } from "../infra/in-memory-category-repository";
import { makeDeleteCategory } from "./delete-category";

describe("deleteCategory", () => {
  it("deletes a category and removes it from tasks", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const deletedAt = new Date("2026-01-02T00:00:00.000Z");

    const categoryRepository = makeInMemoryCategoryRepository();
    const taskRepository = makeInMemoryTaskRepository();

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt,
      updatedAt: createdAt,
    });

    const taskWithCategory = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: category.userId,
      categoryId: category.id,
      title: "Comprar pão",
      createdAt,
      updatedAt: createdAt,
    });

    const taskWithoutCategory = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000004",
      userId: category.userId,
      categoryId: null,
      title: "Estudar TypeScript",
      createdAt,
      updatedAt: createdAt,
    });

    await categoryRepository.create(category);
    await taskRepository.create(taskWithCategory);
    await taskRepository.create(taskWithoutCategory);

    const deleteCategory = makeDeleteCategory({
      categoryRepository,
      taskRepository,
      clock: {
        now: () => deletedAt,
      },
    });

    await deleteCategory({
      id: category.id,
    });

    expect(categoryRepository.items).toHaveLength(0);

    expect(taskRepository.items).toEqual([
      {
        ...taskWithCategory,
        categoryId: null,
        updatedAt: deletedAt,
      },
      taskWithoutCategory,
    ]);
  });

  it("throws when category does not exist", () => {
    const categoryRepository = makeInMemoryCategoryRepository();
    const taskRepository = makeInMemoryTaskRepository();

    const deleteCategory = makeDeleteCategory({
      categoryRepository,
      taskRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      deleteCategory({
        id: "0195f6f9-391f-7000-8000-000000000001",
      }),
    ).rejects.toThrow("Category not found");
  });
});
