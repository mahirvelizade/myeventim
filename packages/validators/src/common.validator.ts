import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type SlugParam = z.infer<typeof slugParamSchema>;
