import { describe, expect, it } from "bun:test";

import type { Clock } from "@shared/clock";
import type { IdGenerator } from "@shared/id-generator";

import type { Task } from "../domain/task.schema";
import type { TaskRepository } from "../ports/task-repository";
import { makeCreateTask } from "./create-task";

describe("createTask", () => {
  it("creates and persists a task", async () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const createdTasks: Task[] = [];

    const taskRepository: TaskRepository = {
      create: async (task) => {
        createdTasks.push(task);
      },
    };

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

    expect(createdTasks).toHaveLength(1);
    expect(createdTasks[0]).toEqual(task);
  });
});
