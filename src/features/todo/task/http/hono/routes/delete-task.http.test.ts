import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/http/hono/http-test-helpers";
import type {
  ErrorHttpResponse,
  ValidationErrorHttpResponse,
} from "@app/http/hono/http-test-types";
import type { TaskResponse } from "@todo/task/http/hono/task-response.schema";

describe("DELETE /tasks/{id}", () => {
  test("deletes a task", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const createResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task to delete",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    const response = await app.request(`/tasks/${createdTask.id}`, {
      method: "DELETE",
    });

    expect(response.status).toBe(204);

    const getResponse = await app.request(`/tasks/${createdTask.id}`);

    expect(getResponse.status).toBe(404);

    const body = await readJson<ErrorHttpResponse>(getResponse);

    expect(body).toEqual({
      message: "Task not found",
    });
  });

  test("returns not found when task does not exist", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request(
      "/tasks/0195f6f9-391f-7000-8000-000000000999",
      {
        method: "DELETE",
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
      method: "DELETE",
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });
});
