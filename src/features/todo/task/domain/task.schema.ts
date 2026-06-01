import { z } from "zod";

export const taskStatusSchema = z.enum(["pending", "done"]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  categoryId: z.uuid().nullable(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable(),
  status: taskStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof taskSchema>;
