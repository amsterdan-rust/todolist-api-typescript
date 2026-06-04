import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/http/hono/http-test-helpers";
import type { CategoryResponse } from "@todo/category/http/hono/category-response.schema";

type ListCategoriesHttpResponse = {
  categories: CategoryResponse[];
};

describe("GET /categories", () => {
  test("lists authenticated user categories", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const firstCreateResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    const secondCreateResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Estudos",
      }),
    });

    const firstCategory = await readJson<CategoryResponse>(firstCreateResponse);
    const secondCategory =
      await readJson<CategoryResponse>(secondCreateResponse);

    const response = await app.request("/categories");

    expect(response.status).toBe(200);

    const body = await readJson<ListCategoriesHttpResponse>(response);

    expect(body.categories).toHaveLength(2);
    expect(body.categories).toContainEqual(firstCategory);
    expect(body.categories).toContainEqual(secondCategory);
  });

  test("returns an empty list when authenticated user has no categories", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request("/categories");

    expect(response.status).toBe(200);

    const body = await readJson<ListCategoriesHttpResponse>(response);

    expect(body).toEqual({
      categories: [],
    });
  });

  test("filters categories by name", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const mercadoResponse = await app.request("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    await app.request("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Estudos",
      }),
    });

    const mercadoCategory = await readJson<CategoryResponse>(mercadoResponse);

    const response = await app.request("/categories?name=merc");

    expect(response.status).toBe(200);

    const body = await readJson<ListCategoriesHttpResponse>(response);

    expect(body).toEqual({
      categories: [mercadoCategory],
    });
  });
});
