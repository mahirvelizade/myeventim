export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
}

export interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  start_param?: string;
  can_send_after?: number;
  auth_date: string;
  hash: string;
}

export interface TelegramBotCommand {
  command: string;
  description: string;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  date: number;
}
