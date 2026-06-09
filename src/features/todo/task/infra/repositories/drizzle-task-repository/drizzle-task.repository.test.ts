// src/features/todo/task/infra/repositories/drizzle-task-repository/drizzle-task.repository.test.ts
import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { db } from "@app/database/local/db";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { signUpTestUser } from "@app/http/hono/http-auth-test-helpers";
import { makeCategory } from "@todo/category/domain/category";
import { makeDrizzleCategoryRepository } from "@todo/category/infra/repositories/drizzle-category-repository/drizzle-category.repository";
import { makeTask } from "@todo/task/domain/task";

import { makeDrizzleTaskRepository } from "./drizzle-task.repository";

const makeAuthenticatedUser = async () => {
  const app = makeHonoApp({
    container: makeContainer(),
  });

  const { user } = await signUpTestUser(app);

  return user;
};

const makeTestTask = ({
  userId,
  categoryId = null,
  title = "Create API",
  description = "Create todo API",
  createdAt = new Date(),
  updatedAt = createdAt,
}: {
  userId: string;
  categoryId?: string | null;
  title?: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}) =>
  makeTask({
    id: crypto.randomUUID(),
    userId,
    categoryId,
    title,
    description,
    createdAt,
    updatedAt,
  });

const makeTestCategory = ({
  userId,
  name = "Work",
}: {
  userId: string;
  name?: string;
}) =>
  makeCategory({
    id: crypto.randomUUID(),
    userId,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

describe("DrizzleTaskRepository", () => {
  test("creates a task", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = makeTestTask({
      userId: user.id,
    });

    const createdTask = await repository.create(task);

    expect(createdTask).toEqual(task);
  });

  test("finds a task by id", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    const foundTask = await repository.findById(task.id);

    expect(foundTask).toEqual(task);
  });

  test("finds a task by id and user id", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    const foundTask = await repository.findByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(foundTask).toEqual(task);
  });

  test("returns null when task does not belong to user", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();
    const anotherUser = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    const foundTask = await repository.findByIdAndUserId({
      id: task.id,
      userId: anotherUser.id,
    });

    expect(foundTask).toBeNull();
  });

  test("checks if task exists by id", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    const exists = await repository.existsById(task.id);

    expect(exists).toBe(true);
  });

  test("checks if task exists by id and user id", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    const exists = await repository.existsByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(exists).toBe(true);
  });

  test("finds task status by id and user id", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    const status = await repository.findStatusByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(status).toBe("pending");
  });

  test("completes a task", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    const updatedAt = new Date();

    const result = await repository.complete({
      id: task.id,
      userId: user.id,
      updatedAt,
    });

    expect(result).toEqual({
      id: task.id,
      updatedAt,
    });

    const updatedTask = await repository.findByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(updatedTask?.status).toBe("done");
  });

  test("reopens a task", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    await repository.complete({
      id: task.id,
      userId: user.id,
      updatedAt: new Date(),
    });

    const updatedAt = new Date();

    const result = await repository.reopen({
      id: task.id,
      userId: user.id,
      updatedAt,
    });

    expect(result).toEqual({
      id: task.id,
      updatedAt,
    });

    const updatedTask = await repository.findByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(updatedTask?.status).toBe("pending");
  });

  test("updates a task", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
        title: "Old title",
        description: "Old description",
      }),
    );

    const updatedAt = new Date();

    const result = await repository.update({
      id: task.id,
      userId: user.id,
      title: "New title",
      description: "New description",
      updatedAt,
    });

    expect(result).toEqual({
      id: task.id,
      updatedAt,
    });

    const updatedTask = await repository.findByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(updatedTask?.title).toBe("New title");
    expect(updatedTask?.description).toBe("New description");
  });

  test("deletes a task", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const task = await repository.create(
      makeTestTask({
        userId: user.id,
      }),
    );

    await repository.delete({
      id: task.id,
      userId: user.id,
    });

    const foundTask = await repository.findByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(foundTask).toBeNull();
  });

  test("lists tasks by user id, status, category id and title", async () => {
    const taskRepository = makeDrizzleTaskRepository({ db });
    const categoryRepository = makeDrizzleCategoryRepository({ db });

    const user = await makeAuthenticatedUser();
    const anotherUser = await makeAuthenticatedUser();

    const category = await categoryRepository.create(
      makeTestCategory({
        userId: user.id,
      }),
    );

    const matchingTask = await taskRepository.create(
      makeTestTask({
        userId: user.id,
        categoryId: category.id,
        title: "Create API",
      }),
    );

    await taskRepository.create(
      makeTestTask({
        userId: user.id,
        categoryId: category.id,
        title: "Write docs",
      }),
    );

    await taskRepository.create(
      makeTestTask({
        userId: anotherUser.id,
        title: "Create API",
      }),
    );

    const tasks = await taskRepository.list({
      userId: user.id,
      status: "pending",
      categoryId: category.id,
      title: "api",
    });

    expect(tasks).toEqual([matchingTask]);
  });

  test("lists tasks ordered by created date", async () => {
    const repository = makeDrizzleTaskRepository({ db });
    const user = await makeAuthenticatedUser();

    const olderTask = await repository.create(
      makeTestTask({
        userId: user.id,
        title: "Older task",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      }),
    );

    const newerTask = await repository.create(
      makeTestTask({
        userId: user.id,
        title: "Newer task",
        createdAt: new Date("2025-01-02T00:00:00.000Z"),
      }),
    );

    const tasks = await repository.list({
      userId: user.id,
      orderBy: "createdAt",
      orderDirection: "asc",
    });

    expect(tasks).toEqual([olderTask, newerTask]);
  });

  test("removes category from tasks", async () => {
    const taskRepository = makeDrizzleTaskRepository({ db });
    const categoryRepository = makeDrizzleCategoryRepository({ db });

    const user = await makeAuthenticatedUser();

    const category = await categoryRepository.create(
      makeTestCategory({
        userId: user.id,
      }),
    );

    const task = await taskRepository.create(
      makeTestTask({
        userId: user.id,
        categoryId: category.id,
      }),
    );

    const updatedAt = new Date();

    await taskRepository.removeCategory({
      categoryId: category.id,
      userId: user.id,
      updatedAt,
    });

    const updatedTask = await taskRepository.findByIdAndUserId({
      id: task.id,
      userId: user.id,
    });

    expect(updatedTask?.categoryId).toBeNull();
    expect(updatedTask?.updatedAt).toEqual(updatedAt);
  });
});
