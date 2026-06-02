import { z } from "zod";

import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
} from "./task.constants";

export const taskStatusSchema = z.enum(["pending", "done"]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  categoryId: z.uuid().nullable(),
  title: z
    .string()
    .trim()
    .min(TASK_TITLE_MIN_LENGTH)
    .max(TASK_TITLE_MAX_LENGTH),
  description: z.string().trim().max(TASK_DESCRIPTION_MAX_LENGTH).nullable(),
  status: taskStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof taskSchema>;
