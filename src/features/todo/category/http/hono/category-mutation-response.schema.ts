import { z } from "@hono/zod-openapi";

export const categoryMutationResponseSchema = z
  .object({
    id: z.uuid().openapi({
      example: "0195f6f9-391f-7000-8000-000000000001",
    }),
    updatedAt: z.iso.datetime().openapi({
      example: "2026-01-02T00:00:00.000Z",
    }),
  })
  .openapi("CategoryMutationResponse");

export type CategoryMutationResponse = z.infer<
  typeof categoryMutationResponseSchema
>;
