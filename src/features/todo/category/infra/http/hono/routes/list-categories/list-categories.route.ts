import { createRoute, z } from "@hono/zod-openapi";

import { categoryResponseSchema } from "../../responses/category-response.schema";

const listCategoriesQuerySchema = z.object({
  name: z.string().optional().openapi({
    example: "Mercado",
  }),
});

const listCategoriesResponseSchema = z
  .object({
    categories: z.array(categoryResponseSchema),
  })
  .openapi("ListCategoriesResponse");

export const listCategoriesRoute = createRoute({
  method: "get",
  path: "/categories",
  tags: ["Categories"],
  summary: "List categories",
  request: {
    query: listCategoriesQuerySchema,
  },
  responses: {
    200: {
      description: "Categories listed",
      content: {
        "application/json": {
          schema: listCategoriesResponseSchema,
        },
      },
    },
  },
});
