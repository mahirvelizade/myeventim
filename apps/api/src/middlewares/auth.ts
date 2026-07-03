import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));

    if (!payload.userId || typeof payload.userId !== 'string') {
      throw new HTTPException(401, { message: 'Invalid token payload: missing userId' });
    }

    c.set('userId', payload.userId);
    c.set('telegramId', payload.telegramId ?? '');
  } catch {
    throw new HTTPException(401, { message: 'Invalid authorization token' });
  }

  await next();
}
