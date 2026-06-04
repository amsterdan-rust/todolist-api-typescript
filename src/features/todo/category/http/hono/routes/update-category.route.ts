import { createRoute, z } from "@hono/zod-openapi";

import { categoryMutationResponseSchema } from "../category-mutation-response.schema";

const updateCategoryParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

const updateCategoryBodySchema = z
  .object({
    name: z.string().min(1).openapi({
      example: "Estudos",
    }),
  })
  .openapi("UpdateCategoryBody");

export const updateCategoryRoute = createRoute({
  method: "patch",
  path: "/categories/{id}",
  tags: ["Categories"],
  summary: "Update category",
  request: {
    params: updateCategoryParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateCategoryBodySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Category updated",
      content: {
        "application/json": {
          schema: categoryMutationResponseSchema,
        },
      },
    },
    404: {
      description: "Category not found",
    },
  },
});
