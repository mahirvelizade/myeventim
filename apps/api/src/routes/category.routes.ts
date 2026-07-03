import { Hono } from 'hono';
import { prisma } from '../services/prisma';

export const categoryRoutes = new Hono()
  .get('/', async (c) => {
    const categories = await prisma.invitationCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return c.json({ success: true, data: categories });
  })
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const category = await prisma.invitationCategory.findUnique({ where: { slug } });
    if (!category) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } }, 404);
    return c.json({ success: true, data: category });
  });
