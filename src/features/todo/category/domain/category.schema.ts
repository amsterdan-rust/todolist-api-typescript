import { z } from "zod";

import {
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_NAME_MIN_LENGTH,
} from "./category.constants";

export const categorySchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  name: z
    .string()
    .trim()
    .min(CATEGORY_NAME_MIN_LENGTH)
    .max(CATEGORY_NAME_MAX_LENGTH),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof categorySchema>;
