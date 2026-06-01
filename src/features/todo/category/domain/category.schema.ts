import { z } from "zod";

export const categorySchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  name: z.string().trim().min(1).max(80),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof categorySchema>;
