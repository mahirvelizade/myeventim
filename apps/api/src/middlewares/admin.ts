import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { telegramConfig } from '@invitely/config';
import { prisma } from '../services/prisma';

export async function adminMiddleware(c: Context, next: Next) {
  const userId = c.get('userId') as string | undefined;
  const telegramId = c.get('telegramId') as string | undefined;

  if (!userId) {
    throw new HTTPException(401, { message: 'Authentication required' });
  }

  if (telegramId && telegramConfig.adminId && telegramId === telegramConfig.adminId) {
    await next();
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.isAdmin) {
    throw new HTTPException(403, { message: 'Admin access required' });
  }

  await next();
}
