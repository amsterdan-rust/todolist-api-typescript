import { describe, expect, it } from "bun:test";

import { makeCategory } from "../../domain/category";
import { makeInMemoryCategoryRepository } from "../../infra/repositories/in-memory-category-repository";
import { makeListCategories } from "./list-categories";

describe("listCategories", () => {
  it("lists only categories from the given user", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const categoryRepository = makeInMemoryCategoryRepository();

    const userCategory = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt: date,
      updatedAt: date,
    });

    const anotherUserCategory = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000004",
      name: "Estudos",
      createdAt: date,
      updatedAt: date,
    });

    await categoryRepository.create(userCategory);
    await categoryRepository.create(anotherUserCategory);

    const listCategories = makeListCategories({
      categoryRepository,
    });

    const categories = await listCategories({
      userId: userCategory.userId,
    });

    expect(categories).toEqual([userCategory]);
  });

  it("filters by name ignoring case", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const categoryRepository = makeInMemoryCategoryRepository();

    const matchedCategory = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt: date,
      updatedAt: date,
    });

    const unmatchedCategory = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Estudos",
      createdAt: date,
      updatedAt: date,
    });

    await categoryRepository.create(matchedCategory);
    await categoryRepository.create(unmatchedCategory);

    const listCategories = makeListCategories({
      categoryRepository,
    });

    const categories = await listCategories({
      userId: matchedCategory.userId,
      name: "merc",
    });

    expect(categories).toEqual([matchedCategory]);
  });
});
