import { z } from 'zod';
import { Theme, Language } from '@invitely/types';

export const createUserSchema = z.object({
  telegramId: z.string().min(1, 'Telegram ID is required'),
  username: z.string().nullable().optional(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().max(100).nullable().optional(),
  language: z.nativeEnum(Language).optional(),
});

export const updateUserSchema = z.object({
  username: z.string().nullable().optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).nullable().optional(),
  language: z.nativeEnum(Language).optional(),
  theme: z.nativeEnum(Theme).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
