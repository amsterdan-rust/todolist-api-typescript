import { z } from "@hono/zod-openapi";

export const meResponseSchema = z.object({
  user: z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
  }),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
