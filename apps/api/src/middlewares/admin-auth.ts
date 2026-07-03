import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { env } from '@invitely/config';

const ADMIN_SECRET = env.ADMIN_SECRET || process.env.ADMIN_SECRET || '';

export async function adminLoginHandler(c: Context) {
  const body = await c.req.json();
  const password = body.password as string | undefined;
  const telegramId = body.telegramId as string | undefined;

  if (password && ADMIN_SECRET && password === ADMIN_SECRET) {
    const payload = Buffer.from(
      JSON.stringify({ userId: 'admin', telegramId: telegramId || 'admin' }),
    ).toString('base64url');
    return c.json({ success: true, data: { token: payload } });
  }

  if (telegramId && env.ADMIN_ID && telegramId === env.ADMIN_ID) {
    const payload = Buffer.from(
      JSON.stringify({ userId: 'admin', telegramId }),
    ).toString('base64url');
    return c.json({ success: true, data: { token: payload } });
  }

  throw new HTTPException(401, { message: 'Invalid admin credentials' });
}
