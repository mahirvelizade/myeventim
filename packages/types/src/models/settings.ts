import type { Theme, Language } from '../enums';

export interface UserSettings {
  id: string;
  userId: string;
  language: Language;
  theme: Theme;
  notificationsEnabled: boolean;
  autoSaveEnabled: boolean;
  highQualityExport: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsInput {
  language?: Language;
  theme?: Theme;
  notificationsEnabled?: boolean;
  autoSaveEnabled?: boolean;
  highQualityExport?: boolean;
}
