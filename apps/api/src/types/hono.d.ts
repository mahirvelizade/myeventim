import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
    telegramId: string;
    telegramUser: Record<string, unknown>;
  }
}

declare module 'hono' {
  interface HonoRequest {
    valid: (target: string) => unknown;
  }
}
