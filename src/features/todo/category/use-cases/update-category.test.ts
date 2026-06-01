import { describe, expect, it } from "bun:test";

import { makeCategory } from "../domain/category";
import { makeInMemoryCategoryRepository } from "../infra/in-memory-category-repository";
import { makeUpdateCategory } from "./update-category";

describe("updateCategory", () => {
  it("updates category name and returns mutation result", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-02T00:00:00.000Z");

    const categoryRepository = makeInMemoryCategoryRepository();

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt,
      updatedAt: createdAt,
    });

    await categoryRepository.create(category);

    const updateCategory = makeUpdateCategory({
      categoryRepository,
      clock: {
        now: () => updatedAt,
      },
    });

    const result = await updateCategory({
      id: category.id,
      name: "Estudos",
    });

    expect(result).toEqual({
      id: category.id,
      updatedAt,
    });

    expect(categoryRepository.items[0]).toEqual({
      ...category,
      name: "Estudos",
      updatedAt,
    });
  });

  it("throws when category does not exist", () => {
    const categoryRepository = makeInMemoryCategoryRepository();

    const updateCategory = makeUpdateCategory({
      categoryRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      updateCategory({
        id: "0195f6f9-391f-7000-8000-000000000001",
        name: "Estudos",
      }),
    ).rejects.toThrow("Category not found");
  });

  it("rejects invalid category name", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");

    const categoryRepository = makeInMemoryCategoryRepository();

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt,
      updatedAt: createdAt,
    });

    categoryRepository.create(category);

    const updateCategory = makeUpdateCategory({
      categoryRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      updateCategory({
        id: category.id,
        name: "",
      }),
    ).rejects.toThrow();
  });
});
