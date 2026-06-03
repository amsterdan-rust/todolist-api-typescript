import { describe, expect, it } from "bun:test";

import { makeTask } from "../../task/domain/task";
import { makeInMemoryTaskRepository } from "../../task/infra/in-memory-task-repository";
import { makeCategory } from "../domain/category";
import { makeInMemoryCategoryRepository } from "../infra/in-memory-category-repository";
import { makeDeleteCategory } from "./delete-category";

describe("deleteCategory", () => {
  it("deletes a category and removes it from authenticated user tasks", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const deletedAt = new Date("2026-01-02T00:00:00.000Z");

    const userId = "0195f6f9-391f-7000-8000-000000000002";

    const categoryRepository = makeInMemoryCategoryRepository();
    const taskRepository = makeInMemoryTaskRepository();

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId,
      name: "Mercado",
      createdAt,
      updatedAt: createdAt,
    });

    const taskWithCategory = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId,
      categoryId: category.id,
      title: "Comprar pão",
      createdAt,
      updatedAt: createdAt,
    });

    const taskWithoutCategory = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000004",
      userId,
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
      userId,
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
        userId: "0195f6f9-391f-7000-8000-000000000002",
      }),
    ).rejects.toThrow("Category not found");
  });

  it("throws when category belongs to another user", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");

    const ownerUserId = "0195f6f9-391f-7000-8000-000000000002";
    const otherUserId = "0195f6f9-391f-7000-8000-000000000003";

    const categoryRepository = makeInMemoryCategoryRepository();
    const taskRepository = makeInMemoryTaskRepository();

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: ownerUserId,
      name: "Mercado",
      createdAt,
      updatedAt: createdAt,
    });

    await categoryRepository.create(category);

    const deleteCategory = makeDeleteCategory({
      categoryRepository,
      taskRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      deleteCategory({
        id: category.id,
        userId: otherUserId,
      }),
    ).rejects.toThrow("Category not found");

    expect(categoryRepository.items).toEqual([category]);
  });
});
