import { describe, expect, it } from "bun:test";

import { makeHonoApp } from "@app/http/hono/hono-app";
import { makeContainer } from "@app/container";

describe("Better Auth HTTP routes", () => {
  it("handles auth routes", async () => {
    const app = makeHonoApp({ container: makeContainer() });

    const response = await app.request("/auth/get-session");

    expect(response.status).not.toBe(404);
  });
});
