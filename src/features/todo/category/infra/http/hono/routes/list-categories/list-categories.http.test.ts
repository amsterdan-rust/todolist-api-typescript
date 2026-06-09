import { describe, expect, test } from "bun:test";

import { makeInMemoryContainer } from "@app/composition/make-in-memory-container";
import { makeHonoApp } from "@app/http/hono/make-hono-app";
import { readJson } from "@app/test-support/http/http-test-helpers";
import type { CategoryResponse } from "@todo/category/infra/http/hono/responses/category-response.schema";
import { makeAuthHeaders } from "@/app/test-support/http/http-auth-test-helpers";

type ListCategoriesHttpResponse = {
  categories: CategoryResponse[];
};

describe("GET /categories", () => {
  test("lists authenticated user categories", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const firstCreateResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    const secondCreateResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Estudos",
      }),
    });

    const firstCategory = await readJson<CategoryResponse>(firstCreateResponse);
    const secondCategory =
      await readJson<CategoryResponse>(secondCreateResponse);

    const response = await app.request("/categories", { headers: authHeaders });

    expect(response.status).toBe(200);

    const body = await readJson<ListCategoriesHttpResponse>(response);

    expect(body.categories).toHaveLength(2);
    expect(body.categories).toContainEqual(firstCategory);
    expect(body.categories).toContainEqual(secondCategory);
  });

  test("returns an empty list when authenticated user has no categories", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const response = await app.request("/categories", { headers: authHeaders });

    expect(response.status).toBe(200);

    const body = await readJson<ListCategoriesHttpResponse>(response);

    expect(body).toEqual({
      categories: [],
    });
  });

  test("filters categories by name", async () => {
    const container = makeInMemoryContainer();
    const app = makeHonoApp({ container });

    const authHeaders = await makeAuthHeaders(app);

    const mercadoResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    await app.request("/categories", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Estudos",
      }),
    });

    const mercadoCategory = await readJson<CategoryResponse>(mercadoResponse);

    const response = await app.request("/categories?name=merc", {
      headers: authHeaders,
    });

    expect(response.status).toBe(200);

    const body = await readJson<ListCategoriesHttpResponse>(response);

    expect(body).toEqual({
      categories: [mercadoCategory],
    });
  });
});
