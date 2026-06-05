import { describe, expect, it } from "bun:test";

import { makeTask } from "../../domain/task";
import { makeInMemoryTaskRepository } from "../../infra/repositories/in-memory-task-repository";
import { makeGetTask } from "./get-task";

describe("getTask", () => {
  it("returns a task by id and userId", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar pão",
      createdAt: date,
      updatedAt: date,
    });

    await taskRepository.create(task);

    const getTask = makeGetTask({
      taskRepository,
    });

    const foundTask = await getTask({
      id: task.id,
      userId: task.userId,
    });

    expect(foundTask).toEqual(task);
  });

  it("throws when task does not exist", () => {
    const taskRepository = makeInMemoryTaskRepository();

    const getTask = makeGetTask({
      taskRepository,
    });

    expect(
      getTask({
        id: "0195f6f9-391f-7000-8000-000000000001",
        userId: "0195f6f9-391f-7000-8000-000000000002",
      }),
    ).rejects.toThrow("Task not found");
  });

  it("throws when task belongs to another user", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar pão",
      createdAt: date,
      updatedAt: date,
    });

    await taskRepository.create(task);

    const getTask = makeGetTask({
      taskRepository,
    });

    expect(
      getTask({
        id: task.id,
        userId: "0195f6f9-391f-7000-8000-000000000003",
      }),
    ).rejects.toThrow("Task not found");
  });
});
