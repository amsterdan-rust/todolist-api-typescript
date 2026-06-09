// src/features/todo/category/infra/repositories/drizzle-category-repository/drizzle-category.repository.test.ts
import { describe, expect, test } from "bun:test";

import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { db } from "@app/database/local/db";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { signUpTestUser } from "@app/test-support/http/http-auth-test-helpers";
import { makeCategory } from "@todo/category/domain/category";

import { makeDrizzleCategoryRepository } from "./drizzle-category.repository";

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

const makeAuthenticatedUser = async () => {
  const app = makeHonoApp({
    container: makeInMemoryContainer(),
  });

  const { user } = await signUpTestUser(app);

  return user;
};

describe("DrizzleCategoryRepository", () => {
  test("creates a category", async () => {
    const repository = makeDrizzleCategoryRepository({ db });
    const user = await makeAuthenticatedUser();

    const category = makeTestCategory({
      userId: user.id,
    });

    const createdCategory = await repository.create(category);

    expect(createdCategory).toEqual(category);
  });

  test("finds a category by id and user id", async () => {
    const repository = makeDrizzleCategoryRepository({ db });
    const user = await makeAuthenticatedUser();

    const category = await repository.create(
      makeTestCategory({
        userId: user.id,
      }),
    );

    const foundCategory = await repository.findById({
      id: category.id,
      userId: user.id,
    });

    expect(foundCategory).toEqual(category);
  });

  test("returns null when category does not belong to user", async () => {
    const repository = makeDrizzleCategoryRepository({ db });
    const user = await makeAuthenticatedUser();
    const anotherUser = await makeAuthenticatedUser();

    const category = await repository.create(
      makeTestCategory({
        userId: user.id,
      }),
    );

    const foundCategory = await repository.findById({
      id: category.id,
      userId: anotherUser.id,
    });

    expect(foundCategory).toBeNull();
  });

  test("checks if category exists by id and user id", async () => {
    const repository = makeDrizzleCategoryRepository({ db });
    const user = await makeAuthenticatedUser();

    const category = await repository.create(
      makeTestCategory({
        userId: user.id,
      }),
    );

    const exists = await repository.existsById({
      id: category.id,
      userId: user.id,
    });

    expect(exists).toBe(true);
  });

  test("updates a category", async () => {
    const repository = makeDrizzleCategoryRepository({ db });
    const user = await makeAuthenticatedUser();

    const category = await repository.create(
      makeTestCategory({
        userId: user.id,
        name: "Old name",
      }),
    );

    const updatedAt = new Date();

    const result = await repository.update({
      id: category.id,
      userId: user.id,
      name: "New name",
      updatedAt,
    });

    expect(result).toEqual({
      id: category.id,
      updatedAt,
    });

    const updatedCategory = await repository.findById({
      id: category.id,
      userId: user.id,
    });

    expect(updatedCategory?.name).toBe("New name");
  });

  test("deletes a category", async () => {
    const repository = makeDrizzleCategoryRepository({ db });
    const user = await makeAuthenticatedUser();

    const category = await repository.create(
      makeTestCategory({
        userId: user.id,
      }),
    );

    await repository.delete({
      id: category.id,
      userId: user.id,
    });

    const foundCategory = await repository.findById({
      id: category.id,
      userId: user.id,
    });

    expect(foundCategory).toBeNull();
  });

  test("lists categories by user id and name", async () => {
    const repository = makeDrizzleCategoryRepository({ db });
    const user = await makeAuthenticatedUser();
    const anotherUser = await makeAuthenticatedUser();

    const workCategory = await repository.create(
      makeTestCategory({
        userId: user.id,
        name: "Work",
      }),
    );

    await repository.create(
      makeTestCategory({
        userId: user.id,
        name: "Personal",
      }),
    );

    await repository.create(
      makeTestCategory({
        userId: anotherUser.id,
        name: "Work",
      }),
    );

    const categories = await repository.list({
      userId: user.id,
      name: "wor",
    });

    expect(categories).toEqual([workCategory]);
  });
});
