import { describe, expect, it } from "bun:test";

import { makeCategory } from "../domain/category";
import { makeInMemoryCategoryRepository } from "../infra/in-memory-category-repository";
import { makeGetCategory } from "./get-category";

describe("getCategory", () => {
  it("returns a category by id and userId", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const userId = "0195f6f9-391f-7000-8000-000000000002";

    const categoryRepository = makeInMemoryCategoryRepository();

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId,
      name: "Mercado",
      createdAt: date,
      updatedAt: date,
    });

    await categoryRepository.create(category);

    const getCategory = makeGetCategory({
      categoryRepository,
    });

    const foundCategory = await getCategory({
      id: category.id,
      userId,
    });

    expect(foundCategory).toEqual(category);
  });

  it("throws when category does not exist", () => {
    const categoryRepository = makeInMemoryCategoryRepository();

    const getCategory = makeGetCategory({
      categoryRepository,
    });

    expect(
      getCategory({
        id: "0195f6f9-391f-7000-8000-000000000001",
        userId: "0195f6f9-391f-7000-8000-000000000002",
      }),
    ).rejects.toThrow("Category not found");
  });

  it("throws when category belongs to another user", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const ownerUserId = "0195f6f9-391f-7000-8000-000000000002";
    const otherUserId = "0195f6f9-391f-7000-8000-000000000003";

    const categoryRepository = makeInMemoryCategoryRepository();

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: ownerUserId,
      name: "Mercado",
      createdAt: date,
      updatedAt: date,
    });

    await categoryRepository.create(category);

    const getCategory = makeGetCategory({
      categoryRepository,
    });

    expect(
      getCategory({
        id: category.id,
        userId: otherUserId,
      }),
    ).rejects.toThrow("Category not found");
  });
});
