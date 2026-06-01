import { describe, expect, it } from "bun:test";

import type { Clock } from "@shared/clock";

import { makeTask } from "../domain/task";
import { makeInMemoryTaskRepository } from "../infra/in-memory-task-repository";
import { makeCompleteTask } from "./complete-task";

describe("completeTask", () => {
  it("marks a task as done and updates updatedAt", async () => {
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

    const clock: Clock = {
      now: () => updatedAt,
    };

    const completeTask = makeCompleteTask({
      taskRepository,
      clock,
    });

    const completedTask = await completeTask({
      id: task.id,
    });

    expect(completedTask).toEqual({
      ...task,
      status: "done",
      updatedAt,
    });

    expect(taskRepository.items[0]).toEqual(completedTask);
  });

  it("throws when task does not exist", async () => {
    const taskRepository = makeInMemoryTaskRepository();

    const clock: Clock = {
      now: () => new Date("2026-01-02T00:00:00.000Z"),
    };

    const completeTask = makeCompleteTask({
      taskRepository,
      clock,
    });

    expect(
      completeTask({
        id: "0195f6f9-391f-7000-8000-000000000001",
      }),
    ).rejects.toThrow("Task not found");
  });
});
