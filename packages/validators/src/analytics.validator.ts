import { z } from 'zod';
import { AnalyticsEventType, DeviceType } from '@invitely/types';

export const createAnalyticsEventSchema = z.object({
  userId: z.string().nullable().optional(),
  eventType: z.nativeEnum(AnalyticsEventType),
  categoryId: z.string().nullable().optional(),
  templateId: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  generationDuration: z.number().nullable().optional(),
  device: z.nativeEnum(DeviceType).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const analyticsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  eventType: z.nativeEnum(AnalyticsEventType).optional(),
  limit: z.coerce.number().int().positive().max(1000).default(100),
});

export type CreateAnalyticsEventInput = z.infer<typeof createAnalyticsEventSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
