import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/http/hono/http-test-helpers";
import type {
  ErrorHttpResponse,
  ValidationErrorHttpResponse,
} from "@app/http/hono/http-test-types";
import type { CategoryMutationResponse } from "@todo/category/infra/http/hono/responses/category-mutation-response.schema";
import type { CategoryResponse } from "@todo/category/infra/http/hono/responses/category-response.schema";
import { makeAuthHeaders } from "@/app/http/hono/http-auth-test-helpers";

describe("PATCH /categories/{id}", () => {
  test("updates a category", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const createResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    const createdCategory = await readJson<CategoryResponse>(createResponse);

    const response = await app.request(`/categories/${createdCategory.id}`, {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Estudos",
      }),
    });

    expect(response.status).toBe(200);

    const body = await readJson<CategoryMutationResponse>(response);

    expect(body.id).toBe(createdCategory.id);
    expect(typeof body.updatedAt).toBe("string");
  });

  test("returns not found when category does not exist", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request(
      "/categories/0195f6f9-391f-7000-8000-000000000999",
      {
        method: "PATCH",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Estudos",
        }),
      },
    );

    expect(response.status).toBe(404);

    const body = await readJson<ErrorHttpResponse>(response);

    expect(body).toEqual({
      message: "Category not found",
    });
  });

  test("returns validation error when id is invalid", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/categories/invalid-id", {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Estudos",
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });

  test("returns validation error when name is empty", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const createResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    const createdCategory = await readJson<CategoryResponse>(createResponse);

    const response = await app.request(`/categories/${createdCategory.id}`, {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "",
      }),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });

  test("returns validation error when required name is missing", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const createResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    const createdCategory = await readJson<CategoryResponse>(createResponse);

    const response = await app.request(`/categories/${createdCategory.id}`, {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });
});
