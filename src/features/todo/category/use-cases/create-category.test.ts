import { describe, expect, it } from "bun:test";

import type { Clock } from "@shared/clock";
import type { IdGenerator } from "@shared/id-generator";

import { makeInMemoryCategoryRepository } from "../infra/in-memory-category-repository";
import { makeCreateCategory } from "./create-category";

describe("createCategory", () => {
  it("creates and persists a category", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const categoryRepository = makeInMemoryCategoryRepository();

    const idGenerator: IdGenerator = {
      generate: () => "0195f6f9-391f-7000-8000-000000000001",
    };

    const clock: Clock = {
      now: () => date,
    };

    const createCategory = makeCreateCategory({
      categoryRepository,
      idGenerator,
      clock,
    });

    const category = await createCategory({
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
    });

    expect(category).toEqual({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt: date,
      updatedAt: date,
    });

    expect(categoryRepository.items).toEqual([category]);
  });

  it("rejects invalid category name", () => {
    const categoryRepository = makeInMemoryCategoryRepository();

    const createCategory = makeCreateCategory({
      categoryRepository,
      idGenerator: {
        generate: () => "0195f6f9-391f-7000-8000-000000000001",
      },
      clock: {
        now: () => new Date("2026-01-01T00:00:00.000Z"),
      },
    });

    expect(
      createCategory({
        userId: "0195f6f9-391f-7000-8000-000000000002",
        name: "",
      }),
    ).rejects.toThrow();
  });
});
