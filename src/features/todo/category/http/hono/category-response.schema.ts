import { z } from "@hono/zod-openapi";

export const categoryResponseSchema = z
  .object({
    id: z.uuid().openapi({
      example: "0195f6f9-391f-7000-8000-000000000001",
    }),
    name: z.string().openapi({
      example: "Mercado",
    }),
    createdAt: z.iso.datetime().openapi({
      example: "2026-01-01T00:00:00.000Z",
    }),
    updatedAt: z.iso.datetime().openapi({
      example: "2026-01-02T00:00:00.000Z",
    }),
  })
  .openapi("CategoryResponse");

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
