import { z } from 'zod';
import { Theme, Language } from '@invitely/types';

export const updateSettingsSchema = z.object({
  language: z.nativeEnum(Language).optional(),
  theme: z.nativeEnum(Theme).optional(),
  notificationsEnabled: z.boolean().optional(),
  autoSaveEnabled: z.boolean().optional(),
  highQualityExport: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
