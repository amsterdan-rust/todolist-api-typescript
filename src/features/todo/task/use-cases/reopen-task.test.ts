import { describe, expect, it } from "bun:test";

import type { Clock } from "@shared/clock";

import { makeTask } from "../domain/task";
import { makeInMemoryTaskRepository } from "../infra/in-memory-task-repository";
import { makeCompleteTask } from "./complete-task";
import { makeReopenTask } from "./reopen-task";

describe("reopenTask", () => {
  it("marks a task as pending and updates updatedAt", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const completedAt = new Date("2026-01-02T00:00:00.000Z");
    const reopenedAt = new Date("2026-01-03T00:00:00.000Z");

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
        now: () => completedAt,
      },
    });

    await completeTask({
      id: task.id,
    });

    const clock: Clock = {
      now: () => reopenedAt,
    };

    const reopenTask = makeReopenTask({
      taskRepository,
      clock,
    });

    const reopenedTask = await reopenTask({
      id: task.id,
    });

    expect(reopenedTask).toEqual({
      ...task,
      status: "pending",
      updatedAt: reopenedAt,
    });

    expect(taskRepository.items[0]).toEqual(reopenedTask);
  });

  it("throws when task does not exist", async () => {
    const taskRepository = makeInMemoryTaskRepository();

    const reopenTask = makeReopenTask({
      taskRepository,
      clock: {
        now: () => new Date("2026-01-03T00:00:00.000Z"),
      },
    });

    expect(
      reopenTask({
        id: "0195f6f9-391f-7000-8000-000000000001",
      }),
    ).rejects.toThrow("Task not found");
  });
});
