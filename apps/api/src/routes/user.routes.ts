import { Hono } from 'hono';
import { zValidator } from '../validators/zvalidator';
import { createUserSchema, updateUserSchema } from '@invitely/validators';
import { userService } from '../services/user.service';

export const userRoutes = new Hono()
  .get('/me', async (c) => {
    const userId = c.get('userId');
    const user = await userService.findById(userId);
    if (!user) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
    return c.json({ success: true, data: user });
  })
  .post('/', zValidator('json', createUserSchema), async (c) => {
    const body = c.req.valid('json');
    const user = await userService.create(body);
    return c.json({ success: true, data: user }, 201);
  })
  .patch('/:id', zValidator('json', updateUserSchema), async (c) => {
    const id = c.req.param('id');
    const body = c.req.valid('json');
    const user = await userService.update(id, body);
    return c.json({ success: true, data: user });
  });
