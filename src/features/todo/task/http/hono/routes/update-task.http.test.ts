import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/http/hono/http-test-helpers";
import type {
  ErrorHttpResponse,
  ValidationErrorHttpResponse,
} from "@app/http/hono/http-test-types";
import type { TaskMutationResponse } from "@todo/task/http/hono/task-mutation-response.schema";
import type { TaskResponse } from "@todo/task/http/hono/task-response.schema";

describe("PATCH /tasks/{id}", () => {
  test("updates a task", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const createResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task before update",
        description: "Description before update",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    const response = await app.request(`/tasks/${createdTask.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task after update",
        description: "Description after update",
      }),
    });

    expect(response.status).toBe(200);

    const body = await readJson<TaskMutationResponse>(response);

    expect(body.id).toBe(createdTask.id);
    expect(typeof body.updatedAt).toBe("string");
  });

  test("returns not found when task does not exist", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request(
      "/tasks/0195f6f9-391f-7000-8000-000000000999",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Updated title",
        }),
      },
    );

    expect(response.status).toBe(404);

    const body = await readJson<ErrorHttpResponse>(response);

    expect(body).toEqual({
      message: "Task not found",
    });
  });

  test("returns validation error when id is invalid", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request("/tasks/invalid-id", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Updated title",
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });

  test("returns validation error when title is empty", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const createResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task before invalid update",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    const response = await app.request(`/tasks/${createdTask.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "",
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });

  test("returns validation error when description is too long", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const createResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task before invalid description update",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    const response = await app.request(`/tasks/${createdTask.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "a".repeat(501),
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });
});
