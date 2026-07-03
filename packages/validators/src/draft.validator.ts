import { z } from 'zod';

export const createDraftSchema = z.object({
  step: z.number().int().min(0).max(7).default(1),
  data: z.record(z.string(), z.unknown()).default({}),
});

export const updateDraftSchema = z.object({
  categoryId: z.string().nullable().optional(),
  templateId: z.string().nullable().optional(),
  step: z.number().int().min(0).max(7).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(['DRAFT', 'COMPLETED', 'ARCHIVED']).optional(),
});

export type CreateDraftInput = z.infer<typeof createDraftSchema>;
export type UpdateDraftInput = z.infer<typeof updateDraftSchema>;
