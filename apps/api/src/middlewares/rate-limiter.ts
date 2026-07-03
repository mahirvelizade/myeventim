import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { apiConfig } from '@invitely/config';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const ipRequests = new Map<string, RateLimitEntry>();
const userRequests = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of ipRequests) {
    if (now > entry.resetAt) ipRequests.delete(key);
  }
  for (const [key, entry] of userRequests) {
    if (now > entry.resetAt) userRequests.delete(key);
  }
}

function checkLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  maxRequests: number,
  windowMs: number,
): void {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (entry.count >= maxRequests) {
    throw new HTTPException(429, { message: 'Too many requests. Please slow down.' });
  }

  entry.count++;
}

export async function rateLimiter(c: Context, next: Next) {
  cleanup();

  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

  checkLimit(ipRequests, ip, apiConfig.rateLimit.max, apiConfig.rateLimit.windowMs);

  const userId = c.get('userId');
  if (userId) {
    checkLimit(userRequests, userId, apiConfig.rateLimit.max * 2, apiConfig.rateLimit.windowMs);
  }

  await next();
}

export async function strictRateLimiter(c: Context, next: Next) {
  cleanup();

  const userId = c.get('userId');
  if (userId) {
    checkLimit(userRequests, userId, 10, apiConfig.rateLimit.windowMs);
  }

  await next();
}
