import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { adminService } from '../services/admin.service';
import { prisma } from '../services/prisma';
import { broadcastService } from '../services/broadcast.service';
import { strictRateLimiter } from '../middlewares/rate-limiter';

export const adminRoutes = new Hono()
  .get('/dashboard', async (c) => {
    const data = await adminService.getDashboard();
    return c.json({ success: true, data });
  })
  .get('/logs', async (c) => {
    const limit = Number(c.req.query('limit')) || 100;
    const type = c.req.query('type');
    const severity = c.req.query('severity');
    const search = c.req.query('search');
    const logs = await adminService.getRecentLogs(limit, type, severity, search);
    return c.json({ success: true, data: logs });
  })
  .get('/logs/errors', async (c) => {
    const limit = Number(c.req.query('limit')) || 50;
    const logs = await adminService.getErrorLogs(limit);
    return c.json({ success: true, data: logs });
  })
  .get('/users', async (c) => {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 20;
    const skip = (page - 1) * limit;
    const search = c.req.query('search') || '';

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { username: { contains: search } },
            { telegramId: { contains: search } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { invitations: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    return c.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  })
  .get('/users/:id', async (c) => {
    const id = c.req.param('id');
    const user = await prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { invitations: true } }, settings: true },
    });
    if (!user) throw new HTTPException(404, { message: 'User not found' });
    return c.json({ success: true, data: user });
  })
  .patch('/users/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const user = await prisma.user.update({ where: { id }, data: body });
    return c.json({ success: true, data: user });
  })
  .get('/invitations', async (c) => {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 20;
    const skip = (page - 1) * limit;
    const status = c.req.query('status');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.invitation.findMany({
        where: where as Parameters<typeof prisma.invitation.findMany>[0]['where'],
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, username: true } } },
      }),
      prisma.invitation.count({ where: where as Parameters<typeof prisma.invitation.count>[0]['where'] }),
    ]);

    return c.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  })
  .get('/templates', async (c) => {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 50;
    const skip = (page - 1) * limit;
    const categoryId = c.req.query('categoryId');

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await Promise.all([
      prisma.invitationTemplate.findMany({
        where: where as Parameters<typeof prisma.invitationTemplate.findMany>[0]['where'],
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.invitationTemplate.count({ where: where as Parameters<typeof prisma.invitationTemplate.count>[0]['where'] }),
    ]);

    return c.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  })
  .post('/templates', async (c) => {
    const body = await c.req.json();
    const template = await prisma.invitationTemplate.create({ data: body });
    return c.json({ success: true, data: template }, 201);
  })
  .patch('/templates/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const template = await prisma.invitationTemplate.update({ where: { id }, data: body });
    return c.json({ success: true, data: template });
  })
  .delete('/templates/:id', async (c) => {
    const id = c.req.param('id');
    await prisma.invitationTemplate.update({ where: { id }, data: { isActive: false } });
    return c.json({ success: true });
  })
  .get('/categories', async (c) => {
    const categories = await prisma.invitationCategory.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { templates: true, invitations: true } } },
    });
    return c.json({ success: true, data: categories });
  })
  .post('/categories', async (c) => {
    const body = await c.req.json();
    const category = await prisma.invitationCategory.create({ data: body });
    return c.json({ success: true, data: category }, 201);
  })
  .patch('/categories/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const category = await prisma.invitationCategory.update({ where: { id }, data: body });
    return c.json({ success: true, data: category });
  })
  .delete('/categories/:id', async (c) => {
    const id = c.req.param('id');
    await prisma.invitationCategory.update({ where: { id }, data: { isActive: false } });
    return c.json({ success: true });
  })
  .get('/broadcasts', async (c) => {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 20;
    const result = await broadcastService.getMessages(page, limit);
    return c.json({ success: true, ...result });
  })
  .post('/broadcasts', strictRateLimiter, async (c) => {
    const body = await c.req.json();
    const userId = c.get('userId');
    const message = await broadcastService.create(body, userId);
    return c.json({ success: true, data: message }, 201);
  })
  .post('/broadcasts/:id/send', strictRateLimiter, async (c) => {
    const id = c.req.param('id');
    const { getBot } = await import('../bot');
    const result = await broadcastService.execute(id, getBot());
    return c.json({ success: true, data: result });
  });
