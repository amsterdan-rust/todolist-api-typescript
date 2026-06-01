import { describe, expect, it } from "bun:test";

import { makeTask } from "@todo/task/domain/task";

describe("makeTask", () => {
  it("creates a pending task", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: null,
      title: "Comprar pão",
      description: null,
      createdAt: date,
      updatedAt: date,
    });

    expect(task).toEqual({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: null,
      title: "Comprar pão",
      description: null,
      status: "pending",
      createdAt: date,
      updatedAt: date,
    });
  });

  it("trims title and description", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "  Comprar pão  ",
      description: "  Ir na padaria  ",
      createdAt: date,
      updatedAt: date,
    });

    expect(task.title).toBe("Comprar pão");
    expect(task.description).toBe("Ir na padaria");
  });

  it("rejects empty title", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    expect(() =>
      makeTask({
        id: "0195f6f9-391f-7000-8000-000000000001",
        userId: "0195f6f9-391f-7000-8000-000000000002",
        title: "",
        createdAt: date,
        updatedAt: date,
      }),
    ).toThrow();
  });
});
