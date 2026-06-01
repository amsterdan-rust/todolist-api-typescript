import { describe, expect, it } from "bun:test";

import { makeTask } from "../domain/task";
import { makeInMemoryTaskRepository } from "../infra/in-memory-task-repository";
import { makeDeleteTask } from "./delete-task";

describe("deleteTask", () => {
  it("deletes a task", async () => {
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

    await makeDeleteTask({
      taskRepository,
    })({
      id: task.id,
    });

    expect(taskRepository.items).toHaveLength(0);
  });

  it("throws when task does not exist", () => {
    const taskRepository = makeInMemoryTaskRepository();

    expect(
      makeDeleteTask({
        taskRepository,
      })({
        id: "0195f6f9-391f-7000-8000-000000000001",
      }),
    ).rejects.toThrow("Task not found");
  });
});
