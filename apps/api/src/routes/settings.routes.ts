import { Hono } from 'hono';
import { zValidator } from '../validators/zvalidator';
import { updateSettingsSchema } from '@invitely/validators';
import { prisma } from '../services/prisma';

export const settingsRoutes = new Hono()
  .get('/', async (c) => {
    const userId = c.get('userId');
    let settings = await prisma.userSettings.findUnique({ where: { userId } });
    if (!settings) {
      settings = await prisma.userSettings.create({ data: { userId } });
    }
    return c.json({ success: true, data: settings });
  })
  .patch('/', zValidator('json', updateSettingsSchema), async (c) => {
    const userId = c.get('userId');
    const body = c.req.valid('json');
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...body },
      update: body,
    });
    return c.json({ success: true, data: settings });
  });
