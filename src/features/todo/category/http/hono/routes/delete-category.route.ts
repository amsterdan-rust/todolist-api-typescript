import { createRoute, z } from "@hono/zod-openapi";

const deleteCategoryParamsSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
});

export const deleteCategoryRoute = createRoute({
  method: "delete",
  path: "/categories/{id}",
  tags: ["Categories"],
  summary: "Delete category",
  request: {
    params: deleteCategoryParamsSchema,
  },
  responses: {
    204: {
      description: "Category deleted",
    },
    404: {
      description: "Category not found",
    },
  },
});
