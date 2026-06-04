import { describe, expect, test } from "bun:test";

import { makeContainer } from "@app/container";
import { makeHonoApp } from "@app/http/hono/hono-app";
import { readJson } from "@app/http/hono/http-test-helpers";
import type { ValidationErrorHttpResponse } from "@app/http/hono/http-test-types";
import type { CategoryResponse } from "@todo/category/http/hono/category-response.schema";

describe("POST /categories", () => {
  test("creates a category using the authenticated user id", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Mercado",
      }),
    });

    expect(response.status).toBe(201);

    const body = await readJson<CategoryResponse>(response);

    expect(body).toEqual({
      id: expect.any(String),
      name: "Mercado",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test("ignores userId from body and uses the authenticated user id", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "0195f6f9-391f-7000-8000-000000000999",
        name: "Estudos",
      }),
    });

    expect(response.status).toBe(201);

    const body = await readJson<CategoryResponse>(response);

    expect(body.name).toBe("Estudos");
  });

  test("returns validation error when name is empty", async () => {
    const container = makeContainer();
    const app = makeHonoApp({ container });

    const response = await app.request("/categories", {
      method: "POST",
      headers: {
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

    const response = await app.request("/categories", {
      method: "POST",
      headers: {
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
