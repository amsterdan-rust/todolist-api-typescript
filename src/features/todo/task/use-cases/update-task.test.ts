import { describe, expect, it } from "bun:test";

import { makeTask } from "../domain/task";
import { makeInMemoryTaskRepository } from "../infra/in-memory-task-repository";
import { makeCompleteTask } from "./complete-task";
import { makeUpdateTask } from "./update-task";

describe("updateTask", () => {
  it("updates title, description and categoryId", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-02T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: null,
      title: "Comprar pão",
      description: null,
      createdAt,
      updatedAt: createdAt,
    });

    await taskRepository.create(task);

    const updateTask = makeUpdateTask({
      taskRepository,
      clock: {
        now: () => updatedAt,
      },
    });

    const updatedTask = await updateTask({
      id: task.id,
      title: "Comprar leite",
      description: "Comprar leite integral",
      categoryId: "0195f6f9-391f-7000-8000-000000000003",
    });

    expect(updatedTask).toEqual({
      ...task,
      title: "Comprar leite",
      description: "Comprar leite integral",
      categoryId: "0195f6f9-391f-7000-8000-000000000003",
      updatedAt,
    });

    expect(taskRepository.items[0]).toEqual(updatedTask);
  });

  it("keeps current values when fields are not provided", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-02T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: "0195f6f9-391f-7000-8000-000000000003",
      title: "Comprar pão",
      description: "Ir na padaria",
      createdAt,
      updatedAt: createdAt,
    });

    await taskRepository.create(task);

    const updateTask = makeUpdateTask({
      taskRepository,
      clock: {
        now: () => updatedAt,
      },
    });

    const updatedTask = await updateTask({
      id: task.id,
    });

    expect(updatedTask).toEqual({
      ...task,
      updatedAt,
    });
  });

  it("can remove description and categoryId", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-02T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const task = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: "0195f6f9-391f-7000-8000-000000000003",
      title: "Comprar pão",
      description: "Ir na padaria",
      createdAt,
      updatedAt: createdAt,
    });

    await taskRepository.create(task);

    const updateTask = makeUpdateTask({
      taskRepository,
      clock: {
        now: () => updatedAt,
      },
    });

    const updatedTask = await updateTask({
      id: task.id,
      description: null,
      categoryId: null,
    });

    expect(updatedTask).toEqual({
      ...task,
      description: null,
      categoryId: null,
      updatedAt,
    });
  });

  it("keeps status when updating a completed task", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const completedAt = new Date("2026-01-02T00:00:00.000Z");
    const updatedAt = new Date("2026-01-03T00:00:00.000Z");

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

    const updateTask = makeUpdateTask({
      taskRepository,
      clock: {
        now: () => updatedAt,
      },
    });

    const updatedTask = await updateTask({
      id: task.id,
      title: "Comprar leite",
    });

    expect(updatedTask).toEqual({
      ...task,
      title: "Comprar leite",
      status: "done",
      updatedAt,
    });
  });

  it("throws when task does not exist", async () => {
    const taskRepository = makeInMemoryTaskRepository();

    const updateTask = makeUpdateTask({
      taskRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      updateTask({
        id: "0195f6f9-391f-7000-8000-000000000001",
        title: "Comprar leite",
      }),
    ).rejects.toThrow("Task not found");
  });

  it("rejects invalid title", async () => {
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

    const updateTask = makeUpdateTask({
      taskRepository,
      clock: {
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      },
    });

    expect(
      updateTask({
        id: task.id,
        title: "",
      }),
    ).rejects.toThrow();
  });
});
