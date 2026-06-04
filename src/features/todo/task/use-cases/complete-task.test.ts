import { describe, expect, it } from "bun:test";

import { makeTask } from "../domain/task";
import { makeInMemoryTaskRepository } from "../infra/in-memory-task-repository";
import { makeCompleteTask } from "./complete-task";

describe("completeTask", () => {
  it("marks a task as done and returns mutation result", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-02T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar pão",
      createdAt,
      updatedAt: createdAt,
    });

    await taskRepository.create(task);

    const completeTask = makeCompleteTask({
      taskRepository,
      clock: {
        now: () => updatedAt,
      },
    });

    const result = await completeTask({
      id: task.id,
      userId: task.userId,
    });

    expect(result).toEqual({
      id: task.id,
      updatedAt,
    });

    expect(taskRepository.items[0]).toEqual({
      ...task,
      status: "done",
      updatedAt,
    });
  });

  it("throws when task does not exist", () => {
    const taskRepository = makeInMemoryTaskRepository();

    const completeTask = makeCompleteTask({
      taskRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      completeTask({
        id: "0195f6f9-391f-7000-8000-000000000001",
        userId: "0195f6f9-391f-7000-8000-000000000002",
      }),
    ).rejects.toThrow("Task not found");
  });

  it("throws when task belongs to another user", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar pão",
      createdAt,
      updatedAt: createdAt,
    });

    await taskRepository.create(task);

    const completeTask = makeCompleteTask({
      taskRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      completeTask({
        id: task.id,
        userId: "0195f6f9-391f-7000-8000-000000000003",
      }),
    ).rejects.toThrow("Task not found");

    expect(taskRepository.items[0]).toEqual(task);
  });

  it("throws when task is already completed", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = {
      ...makeTask({
        id: "0195f6f9-391f-7000-8000-000000000001",
        userId: "0195f6f9-391f-7000-8000-000000000002",
        title: "Comprar pão",
        createdAt,
        updatedAt: createdAt,
      }),
      status: "done" as const,
    };

    await taskRepository.create(task);

    const completeTask = makeCompleteTask({
      taskRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      completeTask({
        id: task.id,
        userId: task.userId,
      }),
    ).rejects.toThrow("Task already completed");

    expect(taskRepository.items[0]).toEqual(task);
  });
});
