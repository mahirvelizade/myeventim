import type { Theme, Language } from '../enums';

export interface User {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  language: Language;
  theme: Theme;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  language?: Language;
}

export interface UpdateUserInput {
  username?: string | null;
  firstName?: string;
  lastName?: string | null;
  language?: Language;
  theme?: Theme;
}
