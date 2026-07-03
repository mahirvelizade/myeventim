import { Hono } from 'hono';
import { featureFlags } from '../services/feature-flags.service';

export const featureFlagsRoutes = new Hono()
  .get('/', async (c) => {
    const flags = await featureFlags.getAll();
    return c.json({ success: true, data: flags });
  })
  .get('/:key', async (c) => {
    const key = c.req.param('key');
    const enabled = await featureFlags.isEnabled(key);
    return c.json({ success: true, data: { key, enabled } });
  })
  .patch('/:key', async (c) => {
    const key = c.req.param('key');
    const body = await c.req.json();
    const flag = await featureFlags.setFlag(key, body.enabled);
    if (!flag) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Flag not found' } }, 404);
    return c.json({ success: true, data: flag });
  })
  .post('/', async (c) => {
    const body = await c.req.json();
    const flag = await featureFlags.createFlag(body.key, body.description, body.enabled);
    if (!flag) return c.json({ success: false, error: { code: 'ERROR', message: 'Failed to create flag' } }, 400);
    return c.json({ success: true, data: flag }, 201);
  });
