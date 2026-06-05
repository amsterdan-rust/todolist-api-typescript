import { z } from "@hono/zod-openapi";

export const taskMutationResponseSchema = z.object({
  id: z.uuid().openapi({
    example: "0195f6f9-391f-7000-8000-000000000001",
  }),

  updatedAt: z.iso.datetime().openapi({
    example: "2026-01-01T00:00:00.000Z",
  }),
});

export type TaskMutationResponse = z.infer<typeof taskMutationResponseSchema>;
