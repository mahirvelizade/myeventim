import { Hono } from 'hono';
import { zValidator } from '../validators/zvalidator';
import { createAnalyticsEventSchema } from '@invitely/validators';
import { prisma } from '../services/prisma';

export const analyticsRoutes = new Hono()
  .post('/events', zValidator('json', createAnalyticsEventSchema), async (c) => {
    const body = c.req.valid('json');
    const event = await prisma.analyticsEvent.create({
      data: {
        userId: body.userId,
        eventType: body.eventType,
        categoryId: body.categoryId,
        templateId: body.templateId,
        language: body.language,
        generationDuration: body.generationDuration,
        device: body.device,
        metadata: body.metadata as Record<string, unknown> | undefined,
      },
    });
    return c.json({ success: true, data: event }, 201);
  });
