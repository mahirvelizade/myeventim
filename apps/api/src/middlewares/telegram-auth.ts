import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createHmac, createHash } from 'node:crypto';
import { env } from '@invitely/config';

export async function telegramAuthMiddleware(c: Context, next: Next) {
  const initData = c.req.header('x-telegram-init-data');

  if (!initData) {
    throw new HTTPException(401, { message: 'Missing Telegram init data' });
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = createHmac('sha256', 'WebAppData').update(env.BOT_TOKEN).digest();
    const computedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (computedHash !== hash) {
      throw new HTTPException(401, { message: 'Invalid Telegram init data' });
    }

    const userStr = params.get('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      c.set('telegramUser', user);
    }
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: 'Invalid Telegram authentication' });
  }

  await next();
}
