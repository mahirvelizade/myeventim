import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { apiConfig } from '@invitely/config';
import { logger } from '@invitely/shared';
import { errorHandler, rateLimiter, authMiddleware, securityHeaders, monitoringMiddleware } from './middlewares';
import { adminLoginHandler } from './middlewares/admin-auth';
import { getMonitoringHandler } from './middlewares/monitoring';
import { apiRouter } from './routes';
import { startBot } from './bot';
import { featureFlags } from './services/feature-flags.service';

const app = new Hono();

app.use('*', honoLogger());
app.use('*', cors({ origin: apiConfig.corsOrigins, credentials: true }));
app.use('*', securityHeaders);
app.use('*', rateLimiter);
app.use('*', monitoringMiddleware);

app.post('/api/admin/login', adminLoginHandler);

app.use('/api/*', authMiddleware);

app.route('/api', apiRouter);

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitely</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
    h1 { color: #333; margin: 0 0 0.5rem; }
    p { color: #666; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Invitely</h1>
    <p>Dəvət kartı generatoru</p>
  </div>
</body>
</html>`);
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

app.get('/ready', (c) => {
  return c.json({ status: 'ready', timestamp: new Date().toISOString() });
});

app.get('/metrics', getMonitoringHandler());

app.onError(errorHandler);

serve(
  {
    fetch: app.fetch,
    port: apiConfig.port,
  },
  async (info) => {
    logger.info('API server started', {
      context: 'startup',
      port: info.port,
      nodeEnv: process.env.NODE_ENV || 'development',
    });
    await featureFlags.init();
    startBot().catch((err) => logger.error('Failed to start bot', { error: String(err) }));
  },
);
