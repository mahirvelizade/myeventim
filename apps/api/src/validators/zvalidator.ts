import { z } from 'zod';
import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

type ValidationTarget = 'json' | 'query' | 'param' | 'form';

const validatedData = new WeakMap<Context, Record<string, unknown>>();

export function zValidator(target: ValidationTarget, schema: z.ZodSchema) {
  return async (c: Context, next: Next) => {
    let data: unknown;

    switch (target) {
      case 'json':
        try {
          data = await c.req.json();
        } catch {
          throw new HTTPException(400, { message: 'Invalid JSON body' });
        }
        break;
      case 'query':
        data = c.req.queries();
        break;
      case 'param':
        data = c.req.param();
        break;
      case 'form':
        data = await c.req.parseBody();
        break;
      default:
        throw new HTTPException(500, { message: `Unknown validation target: ${target}` });
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      throw new HTTPException(400, {
        message: 'Validation failed',
      });
    }

    const existing = validatedData.get(c) || {};
    existing[target] = result.data;
    validatedData.set(c, existing);

    c.req.valid = (_target: ValidationTarget) => {
      const store = validatedData.get(c);
      return store?.[_target] as Record<string, unknown>;
    };

    await next();
  };
}
