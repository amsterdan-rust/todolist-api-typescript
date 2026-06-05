import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/http/hono/http-test-helpers";
import type {
  ErrorHttpResponse,
  ValidationErrorHttpResponse,
} from "@app/http/hono/http-test-types";
import type { TaskResponse } from "../../responses/task-response.schema";

describe("GET /tasks/{id}", () => {
  test("gets a task by id", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const createResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task to get",
        description: "Task description",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    const response = await app.request(`/tasks/${createdTask.id}`);

    expect(response.status).toBe(200);

    const body = await readJson<TaskResponse>(response);

    expect(body).toEqual(createdTask);
  });

  test("returns not found when task does not exist", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request(
      "/tasks/0195f6f9-391f-7000-8000-000000000999",
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

    const response = await app.request("/tasks/invalid-id");

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });
});
