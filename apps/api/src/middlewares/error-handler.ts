import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { logger } from '@invitely/shared';

export function errorHandler(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: {
          code: err.status === 429 ? 'RATE_LIMITED' : 'HTTP_ERROR',
          message: err.message,
        },
      },
      err.status,
    );
  }

  logger.error('Unhandled error', { error: err.message, stack: err.stack });

  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again.',
      },
    },
    500,
  );
}
