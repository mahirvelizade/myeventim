import { Hono } from 'hono';
import { zValidator } from '../validators/zvalidator';
import { createInvitationSchema, updateInvitationSchema, paginationSchema } from '@invitely/validators';
import { prisma } from '../services/prisma';

export const invitationRoutes = new Hono()
  .get('/', zValidator('query', paginationSchema), async (c) => {
    const userId = c.get('userId');
    const { page, limit } = c.req.valid('query');
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.invitation.findMany({ where: { userId }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.invitation.count({ where: { userId } }),
    ]);

    return c.json({
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Invitation not found' } }, 404);
    return c.json({ success: true, data: invitation });
  })
  .post('/', zValidator('json', createInvitationSchema), async (c) => {
    const userId = c.get('userId');
    const body = c.req.valid('json');
    const invitation = await prisma.invitation.create({
      data: { ...body, userId },
    });
    return c.json({ success: true, data: invitation }, 201);
  })
  .patch('/:id', zValidator('json', updateInvitationSchema), async (c) => {
    const id = c.req.param('id');
    const body = c.req.valid('json');
    const invitation = await prisma.invitation.update({ where: { id }, data: body });
    return c.json({ success: true, data: invitation });
  })
  .delete('/:id', async (c) => {
    const id = c.req.param('id');
    await prisma.invitation.delete({ where: { id } });
    return c.json({ success: true });
  });
