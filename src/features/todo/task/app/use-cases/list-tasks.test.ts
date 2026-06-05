import { describe, expect, it } from "bun:test";

import { makeTask } from "../../domain/task";
import { makeInMemoryTaskRepository } from "../../infra/repositories/in-memory-task-repository";
import { makeCompleteTask } from "./complete-task";
import { makeListTasks } from "./list-tasks";

describe("listTasks", () => {
  it("lists only tasks from the given user", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const taskRepository = makeInMemoryTaskRepository();

    const userTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar pão",
      createdAt: date,
      updatedAt: date,
    });

    const anotherUserTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000004",
      title: "Comprar leite",
      createdAt: date,
      updatedAt: date,
    });

    await taskRepository.create(userTask);
    await taskRepository.create(anotherUserTask);

    const listTasks = makeListTasks({ taskRepository });

    const tasks = await listTasks({
      userId: userTask.userId,
    });

    expect(tasks).toEqual([userTask]);
  });

  it("filters by status", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const completedAt = new Date("2026-01-02T00:00:00.000Z");
    const taskRepository = makeInMemoryTaskRepository();

    const pendingTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar pão",
      createdAt,
      updatedAt: createdAt,
    });

    const doneTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar leite",
      createdAt,
      updatedAt: createdAt,
    });

    await taskRepository.create(pendingTask);
    await taskRepository.create(doneTask);

    const completeTask = makeCompleteTask({
      taskRepository,
      clock: {
        now: () => completedAt,
      },
    });

    await completeTask({
      id: doneTask.id,
      userId: doneTask.userId,
    });

    const listTasks = makeListTasks({ taskRepository });

    const tasks = await listTasks({
      userId: pendingTask.userId,
      status: "done",
    });

    expect(tasks).toEqual([
      {
        ...doneTask,
        status: "done",
        updatedAt: completedAt,
      },
    ]);
  });

  it("filters by categoryId", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const taskRepository = makeInMemoryTaskRepository();

    const matchedTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: "0195f6f9-391f-7000-8000-000000000003",
      title: "Comprar pão",
      createdAt: date,
      updatedAt: date,
    });

    const unmatchedTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000004",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: null,
      title: "Comprar leite",
      createdAt: date,
      updatedAt: date,
    });

    await taskRepository.create(matchedTask);
    await taskRepository.create(unmatchedTask);

    const listTasks = makeListTasks({ taskRepository });

    const tasks = await listTasks({
      userId: matchedTask.userId,
      categoryId: matchedTask.categoryId,
    });

    expect(tasks).toEqual([matchedTask]);
  });

  it("filters tasks without category", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const taskRepository = makeInMemoryTaskRepository();

    const withoutCategoryTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: null,
      title: "Comprar pão",
      createdAt: date,
      updatedAt: date,
    });

    const withCategoryTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      categoryId: "0195f6f9-391f-7000-8000-000000000004",
      title: "Comprar leite",
      createdAt: date,
      updatedAt: date,
    });

    await taskRepository.create(withoutCategoryTask);
    await taskRepository.create(withCategoryTask);

    const listTasks = makeListTasks({ taskRepository });

    const tasks = await listTasks({
      userId: withoutCategoryTask.userId,
      categoryId: null,
    });

    expect(tasks).toEqual([withoutCategoryTask]);
  });

  it("filters by title ignoring case", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const taskRepository = makeInMemoryTaskRepository();

    const matchedTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Comprar Pão",
      createdAt: date,
      updatedAt: date,
    });

    const unmatchedTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Estudar TypeScript",
      createdAt: date,
      updatedAt: date,
    });

    await taskRepository.create(matchedTask);
    await taskRepository.create(unmatchedTask);

    const listTasks = makeListTasks({ taskRepository });

    const tasks = await listTasks({
      userId: matchedTask.userId,
      title: "pão",
    });

    expect(tasks).toEqual([matchedTask]);
  });

  it("orders by createdAt ascending", async () => {
    const firstDate = new Date("2026-01-01T00:00:00.000Z");
    const secondDate = new Date("2026-01-02T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const firstTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Primeira",
      createdAt: firstDate,
      updatedAt: firstDate,
    });

    const secondTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Segunda",
      createdAt: secondDate,
      updatedAt: secondDate,
    });

    await taskRepository.create(secondTask);
    await taskRepository.create(firstTask);

    const listTasks = makeListTasks({ taskRepository });

    const tasks = await listTasks({
      userId: firstTask.userId,
      orderBy: "createdAt",
      orderDirection: "asc",
    });

    expect(tasks).toEqual([firstTask, secondTask]);
  });

  it("orders by createdAt descending by default", async () => {
    const firstDate = new Date("2026-01-01T00:00:00.000Z");
    const secondDate = new Date("2026-01-02T00:00:00.000Z");

    const taskRepository = makeInMemoryTaskRepository();

    const firstTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000001",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Primeira",
      createdAt: firstDate,
      updatedAt: firstDate,
    });

    const secondTask = makeTask({
      id: "0195f6f9-391f-7000-8000-000000000003",
      userId: "0195f6f9-391f-7000-8000-000000000002",
      title: "Segunda",
      createdAt: secondDate,
      updatedAt: secondDate,
    });

    await taskRepository.create(firstTask);
    await taskRepository.create(secondTask);

    const listTasks = makeListTasks({ taskRepository });

    const tasks = await listTasks({
      userId: firstTask.userId,
    });

    expect(tasks).toEqual([secondTask, firstTask]);
  });
});
