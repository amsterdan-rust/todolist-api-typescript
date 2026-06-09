import { describe, expect, it } from "bun:test";

import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/test-support/http/http-test-helpers";
import type { TaskResponse } from "../../responses/task-response.schema";
import type { ValidationErrorHttpResponse } from "@app/test-support/http/http-test-types";
import { makeAuthHeaders } from "@/app/test-support/http/http-auth-test-helpers";

const makeTestApp = () =>
  makeHonoApp({
    container: makeInMemoryContainer(),
  });

describe("POST /tasks", () => {
  it("creates a task using the authenticated user id", async () => {
    const app = makeTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Comprar pão",
        description: "Ir na padaria",
        categoryId: null,
      }),
    });

    expect(response.status).toBe(201);

    const body = await readJson<TaskResponse>(response);

    expect(body).toEqual({
      id: expect.any(String),
      categoryId: null,
      title: "Comprar pão",
      description: "Ir na padaria",
      status: "pending",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("ignores userId from body and uses the authenticated user id", async () => {
    const app = makeTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "0195f6f9-391f-7000-8000-999999999999",
        title: "Comprar pão",
        description: null,
        categoryId: null,
      }),
    });

    expect(response.status).toBe(201);

    const body = await readJson<TaskResponse>(response);
  });

  it("returns validation error when title is empty", async () => {
    const app = makeTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "",
        description: "Ir na padaria",
        categoryId: null,
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues).toBeArray();
  });

  it("returns validation error when categoryId is invalid", async () => {
    const app = makeTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Comprar pão",
        description: null,
        categoryId: "invalid-category-id",
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues).toBeArray();
  });

  it("returns validation error when description is too long", async () => {
    const app = makeTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Comprar pão",
        description: "a".repeat(501),
        categoryId: null,
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues).toBeArray();
  });

  it("returns validation error when required title is missing", async () => {
    const app = makeTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: null,
        categoryId: null,
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues).toBeArray();
  });
});
