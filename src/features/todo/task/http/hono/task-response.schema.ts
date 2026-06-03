import { z } from "@hono/zod-openapi";

export const taskResponseSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),
  userId: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000002",
  }),
  categoryId: z.uuid().nullable().openapi({
    example: null,
  }),
  title: z.string().openapi({
    example: "Comprar pão",
  }),
  description: z.string().nullable().openapi({
    example: "Ir na padaria",
  }),
  status: z.enum(["pending", "done"]).openapi({
    example: "pending",
  }),
  createdAt: z.iso.datetime().openapi({
    example: "2026-01-01T00:00:00.000Z",
  }),
  updatedAt: z.iso.datetime().openapi({
    example: "2026-01-01T00:00:00.000Z",
  }),
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;
