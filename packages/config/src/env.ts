import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  BOT_TOKEN: z.string().default(''),
  BOT_USERNAME: z.string().optional(),
  ADMIN_ID: z.string().optional(),
  ADMIN_SECRET: z.string().optional(),

  DATABASE_URL: z.string().default('postgresql://localhost:5432/dummy'),

  APP_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:3001'),

  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_BOT_USERNAME: z.string().optional(),

  STORAGE_DRIVER: z.enum(['local', 's3', 'r2', 'supabase']).default('local'),
  STORAGE_PATH: z.string().default('./storage'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['pretty', 'json']).default('pretty'),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(env: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    for (const [key, errors] of Object.entries(formatted)) {
      console.warn(`  ${key}: ${errors?.join(', ')}`);
    }
    return envSchema.parse(env);
  }
  return result.data;
}

export const env = parseEnv(process.env as Record<string, string | undefined>);
