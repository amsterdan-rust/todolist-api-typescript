import { describe, expect, test } from "bun:test";
import { readJson } from "@app/test-support/http/http-test-helpers";
import type {
  ErrorHttpResponse,
  ValidationErrorHttpResponse,
} from "@app/test-support/http/http-test-types";
import type { CategoryResponse } from "@todo/category/infra/http/hono/responses/category-response.schema";
import {
  makeAuthHeaders,
  makeLocalHttpTestApp,
} from "@/app/test-support/http/http-auth-test-helpers";

describe("DELETE /categories/{id}", () => {
  test("deletes a category", async () => {
    const app = makeLocalHttpTestApp();
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
      method: "DELETE",
      headers: authHeaders,
    });

    expect(response.status).toBe(204);

    const getResponse = await app.request(`/categories/${createdCategory.id}`, {
      headers: authHeaders,
    });

    expect(getResponse.status).toBe(404);

    const body = await readJson<ErrorHttpResponse>(getResponse);

    expect(body).toEqual({
      message: "Category not found",
    });
  });

  test("returns not found when category does not exist", async () => {
    const app = makeLocalHttpTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request(
      "/categories/0195f6f9-391f-7000-8000-000000000999",
      {
        method: "DELETE",
        headers: authHeaders,
      },
    );

    expect(response.status).toBe(404);

    const body = await readJson<ErrorHttpResponse>(response);

    expect(body).toEqual({
      message: "Category not found",
    });
  });

  test("returns validation error when id is invalid", async () => {
    const app = makeLocalHttpTestApp();
    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/categories/invalid-id", {
      method: "DELETE",
      headers: authHeaders,
    });

    expect(response.status).toBe(400);

    const body = await readJson<ValidationErrorHttpResponse>(response);

    expect(body.message).toBe("Validation error");
    expect(body.issues.length).toBeGreaterThan(0);
  });
});
