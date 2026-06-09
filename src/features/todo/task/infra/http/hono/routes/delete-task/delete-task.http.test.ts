import { describe, expect, test } from "bun:test";

import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { makeHonoApp } from "@app/http/hono/make-hono-app";
import { readJson } from "@app/test-support/http/http-test-helpers";
import type {
  ErrorHttpResponse,
  ValidationErrorHttpResponse,
} from "@app/test-support/http/http-test-types";
import type { TaskResponse } from "@todo/task/infra/http/hono/responses/task-response.schema";
import { makeAuthHeaders } from "@/app/test-support/http/http-auth-test-helpers";

describe("DELETE /tasks/{id}", () => {
  test("deletes a task", async () => {
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
        title: "Task to delete",
      }),
    });

    const createdTask = await readJson<TaskResponse>(createResponse);

    const response = await app.request(`/tasks/${createdTask.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    expect(response.status).toBe(204);

    const getResponse = await app.request(`/tasks/${createdTask.id}`, {
      headers: authHeaders,
    });

    expect(getResponse.status).toBe(404);

    const body = await readJson<ErrorHttpResponse>(getResponse);

    expect(body).toEqual({
      message: "Task not found",
    });
  });

  test("returns not found when task does not exist", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request(
      "/tasks/0195f6f9-391f-7000-8000-000000000999",
      {
        method: "DELETE",
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

    const response = await app.request("/tasks/invalid-id", {
      method: "DELETE",
      headers: authHeaders,
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });
});
