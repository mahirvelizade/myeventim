import { Hono } from 'hono';
import { prisma } from '../services/prisma';

export const templateRoutes = new Hono()
  .get('/', async (c) => {
    const categoryId = c.req.query('categoryId');
    const where = { isActive: true } as Record<string, unknown>;
    if (categoryId) where.categoryId = categoryId;

    const templates = await prisma.invitationTemplate.findMany({
      where: where as Parameters<typeof prisma.invitationTemplate.findMany>[0]['where'],
      orderBy: { createdAt: 'desc' },
    });
    return c.json({ success: true, data: templates });
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const template = await prisma.invitationTemplate.findUnique({ where: { id } });
    if (!template) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Template not found' } }, 404);
    return c.json({ success: true, data: template });
  });
