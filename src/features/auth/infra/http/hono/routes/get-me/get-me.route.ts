import { createRoute, z } from "@hono/zod-openapi";

import { meResponseSchema } from "../../responses/me-response.schema";

export const getMeRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Auth"],
  summary: "Get current authenticated user",
  responses: {
    200: {
      description: "Current authenticated user",
      content: {
        "application/json": {
          schema: meResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});
