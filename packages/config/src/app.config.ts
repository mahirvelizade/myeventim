import { env } from './env';

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  url: string;
  nodeEnv: string;
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
}

export const appConfig: AppConfig = {
  name: 'Invitely',
  version: '1.0.0',
  description: 'Telegram Mini App for generating beautiful digital invitation cards',
  url: env.APP_URL,
  nodeEnv: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
};
