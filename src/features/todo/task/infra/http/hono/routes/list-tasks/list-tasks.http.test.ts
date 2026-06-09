import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/test-support/http/http-test-helpers";
import type { TaskResponse } from "@todo/task/infra/http/hono/responses/task-response.schema";
import { makeAuthHeaders } from "@/app/test-support/http/http-auth-test-helpers";

type ListTasksHttpResponse = {
  tasks: TaskResponse[];
};

describe("GET /tasks", () => {
  test("lists authenticated user tasks", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });
    const authHeaders = await makeAuthHeaders(app);

    const firstCreateResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "First task",
      }),
    });

    const secondCreateResponse = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Second task",
      }),
    });

    const firstTask = await readJson<TaskResponse>(firstCreateResponse);
    const secondTask = await readJson<TaskResponse>(secondCreateResponse);

    const response = await app.request("/tasks", { headers: authHeaders });

    expect(response.status).toBe(200);

    const body = await readJson<ListTasksHttpResponse>(response);

    expect(body.tasks).toHaveLength(2);
    expect(body.tasks).toContainEqual(firstTask);
    expect(body.tasks).toContainEqual(secondTask);
  });

  test("returns an empty list when authenticated user has no tasks", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks", { headers: authHeaders });

    expect(response.status).toBe(200);

    const body = await readJson<ListTasksHttpResponse>(response);

    expect(body).toEqual({
      tasks: [],
    });
  });
});
