import { createRoute, z } from "@hono/zod-openapi";

import { categoryResponseSchema } from "../../responses/category-response.schema";

const createCategoryBodySchema = z
  .object({
    name: z.string().openapi({
      example: "Mercado",
    }),
  })
  .openapi("CreateCategoryBody");

export const createCategoryRoute = createRoute({
  method: "post",
  path: "/categories",
  tags: ["Categories"],
  summary: "Create category",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createCategoryBodySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Category created",
      content: {
        "application/json": {
          schema: categoryResponseSchema,
        },
      },
    },
  },
});
