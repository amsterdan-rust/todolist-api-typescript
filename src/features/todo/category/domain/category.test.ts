import { describe, expect, it } from "bun:test";

import { makeCategory } from "./category";

describe("makeCategory", () => {
  it("creates a category", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt: date,
      updatedAt: date,
    });

    expect(category).toEqual({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "Mercado",
      createdAt: date,
      updatedAt: date,
    });
  });

  it("trims name", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const category = makeCategory({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      name: "  Mercado  ",
      createdAt: date,
      updatedAt: date,
    });

    expect(category.name).toBe("Mercado");
  });

  it("rejects empty name", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    expect(() =>
      makeCategory({
        id: "0195f6f9-391f-7000-8000-000000000001",
        userId: "0195f6f9-391f-7000-8000-000000000002",
        name: "",
        createdAt: date,
        updatedAt: date,
      }),
    ).toThrow();
  });
});
