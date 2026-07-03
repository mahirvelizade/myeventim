import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
