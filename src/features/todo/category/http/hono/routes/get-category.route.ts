import { createRoute, z } from "@hono/zod-openapi";

import { categoryResponseSchema } from "../category-response.schema";

const getCategoryParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

export const getCategoryRoute = createRoute({
  method: "get",
  path: "/categories/{id}",
  tags: ["Categories"],
  summary: "Get category",
  request: {
    params: getCategoryParamsSchema,
  },
  responses: {
    200: {
      description: "Category found",
      content: {
        "application/json": {
          schema: categoryResponseSchema,
        },
      },
    },
    404: {
      description: "Category not found",
    },
  },
});
