import { z } from 'zod';

export const templateFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'date', 'time', 'textarea', 'image']),
  required: z.boolean().default(false),
  maxLength: z.number().int().positive().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
});

export const templateMetadataSchema = z.object({
  orientation: z.enum(['portrait', 'landscape']),
  aspectRatio: z.string(),
  backgroundColor: z.string(),
  fontFamily: z.string(),
  fontColor: z.string(),
  accentColor: z.string(),
  stickers: z.array(z.string()).optional(),
  decorations: z.array(z.string()).optional(),
  layout: z.string(),
  fields: z.array(templateFieldSchema),
});

export const createTemplateSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  previewUrl: z.string().url().optional().or(z.literal('')),
  isPremium: z.boolean().default(false),
  metadata: templateMetadataSchema,
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type TemplateFieldInput = z.infer<typeof templateFieldSchema>;
export type TemplateMetadataInput = z.infer<typeof templateMetadataSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
