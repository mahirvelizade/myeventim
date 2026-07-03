import { env } from './env';

export interface TelegramConfig {
  botToken: string;
  botUsername: string;
  adminId: string;
  miniAppUrl: string;
}

export const telegramConfig: TelegramConfig = {
  botToken: env.BOT_TOKEN,
  botUsername: env.NEXT_PUBLIC_BOT_USERNAME ?? 'invitely_bot',
  adminId: env.ADMIN_ID ?? '',
  miniAppUrl: env.APP_URL,
};
