import { describe, expect, test } from "bun:test";

import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/test-support/http/http-test-helpers";
import type {
  ErrorHttpResponse,
  ValidationErrorHttpResponse,
} from "@app/test-support/http/http-test-types";
import type { TaskMutationResponse } from "@todo/task/infra/http/hono/responses/task-mutation-response.schema";
import type { TaskResponse } from "@todo/task/infra/http/hono/responses/task-response.schema";
import { makeAuthHeaders } from "@/app/test-support/http/http-auth-test-helpers";

describe("PATCH /tasks/{id}/complete", () => {
  test("completes a task", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const createResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task to complete",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    const response = await app.request(`/tasks/${createdTask.id}/complete`, {
      method: "PATCH",
      headers: authHeaders,
    });

    expect(response.status).toBe(200);

    const body = await readJson<TaskMutationResponse>(response);

    expect(body.id).toBe(createdTask.id);
    expect(typeof body.updatedAt).toBe("string");
  });

  test("returns not found when task does not exist", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request(
      "/tasks/0195f6f9-391f-7000-8000-000000000999/complete",
      {
        method: "PATCH",
        headers: authHeaders,
      },
    );

    expect(response.status).toBe(404);

    const body = await readJson<ErrorHttpResponse>(response);

    expect(body).toEqual({
      message: "Task not found",
    });
  });

  test("returns validation error when id is invalid", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks/invalid-id/complete", {
      method: "PATCH",
      headers: authHeaders,
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });

  test("returns conflict when task is already completed", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const createResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Task already completed",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    await app.request(`/tasks/${createdTask.id}/complete`, {
      method: "PATCH",
      headers: authHeaders,
    });

    const response = await app.request(`/tasks/${createdTask.id}/complete`, {
      method: "PATCH",
      headers: authHeaders,
    });

    expect(response.status).toBe(409);

    const body = await readJson<ErrorHttpResponse>(response);

    expect(body).toEqual({
      message: "Task already completed",
    });
  });
});
