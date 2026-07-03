import type { Context, Next } from 'hono';

export async function securityHeaders(c: Context, next: Next) {
  await next();

  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  c.res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'",
  );
}

export async function requestSanitizer(c: Context, next: Next) {
  const contentType = c.req.header('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const body = await c.req.raw.clone().json();
      if (body && typeof body === 'object') {
        sanitizeObject(body);
      }
    } catch {
      throw new Error('Invalid JSON body');
    }
  }
  await next();
}

function sanitizeObject(obj: Record<string, unknown>): void {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      (obj as Record<string, string>)[key] = (obj[key] as string)
        .replace(/[<>&"']/g, '')
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key] as Record<string, unknown>);
    }
  }
}
