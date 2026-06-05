import { describe, expect, it } from "bun:test";

import type { Clock } from "@shared/clock";
import type { IdGenerator } from "@shared/id-generator";

import { makeInMemoryTaskRepository } from "../../infra/repositories/in-memory-task-repository";
import { makeCreateTask } from "./create-task";

describe("createTask", () => {
  it("creates and persists a task", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const idGenerator: IdGenerator = {
      generate: () => "0195f6f9-391f-7000-8000-000000000001",
    };

    const clock: Clock = {
      now: () => date,
    };

    const createTask = makeCreateTask({
      taskRepository,
      idGenerator,
      clock,
    });

    const task = await createTask({
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar pão",
      description: "Ir na padaria",
    });

    expect(task).toEqual({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: null,
      title: "Comprar pão",
      description: "Ir na padaria",
      status: "pending",
      createdAt: date,
      updatedAt: date,
    });

    expect(taskRepository.items).toHaveLength(1);

    const createdTask = taskRepository.items.at(0);

    expect(createdTask).toEqual(task);
  });
});
