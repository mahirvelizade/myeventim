import type { Language } from '../enums';

export interface LanguageConfig {
  current: Language;
  locale: string;
  direction: 'ltr' | 'rtl';
  messages: Record<string, string>;
}

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}
