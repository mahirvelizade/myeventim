import { Hono } from 'hono';
import { zValidator } from '../validators/zvalidator';
import { createDraftSchema, updateDraftSchema } from '@invitely/validators';
import { prisma } from '../services/prisma';

export const draftRoutes = new Hono()
  .get('/current', async (c) => {
    const userId = c.get('userId');
    const draft = await prisma.draft.findFirst({
      where: { userId, status: 'DRAFT', expiresAt: { gte: new Date() } },
      orderBy: { updatedAt: 'desc' },
    });
    return c.json({ success: true, data: draft });
  })
  .post('/', zValidator('json', createDraftSchema), async (c) => {
    const userId = c.get('userId');
    const body = c.req.valid('json');
    const draft = await prisma.draft.create({
      data: {
        userId,
        step: body.step,
        data: body.data as Record<string, unknown>,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return c.json({ success: true, data: draft }, 201);
  })
  .patch('/:id', zValidator('json', updateDraftSchema), async (c) => {
    const id = c.req.param('id');
    const body = c.req.valid('json');
    const draft = await prisma.draft.update({ where: { id }, data: body as Record<string, unknown> });
    return c.json({ success: true, data: draft });
  })
  .delete('/:id', async (c) => {
    const id = c.req.param('id');
    await prisma.draft.delete({ where: { id } });
    return c.json({ success: true });
  });
