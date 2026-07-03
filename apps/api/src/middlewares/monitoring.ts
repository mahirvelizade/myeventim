import type { Context, Next } from 'hono';
import { observability } from '@invitely/shared';

export async function monitoringMiddleware(c: Context, next: Next) {
  const start = performance.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const duration = performance.now() - start;
  const statusCode = c.res.status;
  const userId = c.get('userId') as string | undefined;

  observability.recordRequest(method, path, statusCode, duration, userId);
}

export function getMonitoringHandler() {
  return async (c: Context) => {
    const requestStats = observability.getRequestStats();
    const systemMetrics = observability.getSystemMetrics();
    const metricNames = observability.getAllMetricNames();

    const metrics: Record<string, unknown> = {};
    for (const name of metricNames) {
      const points = observability.getMetric(name);
      if (points.length > 0) {
        metrics[name] = {
          count: points.length,
          avg: Math.round(points.reduce((a, p) => a + p.value, 0) / points.length),
          min: Math.round(Math.min(...points.map((p) => p.value))),
          max: Math.round(Math.max(...points.map((p) => p.value))),
        };
      }
    }

    return c.json({
      success: true,
      data: {
        requests: requestStats,
        system: systemMetrics,
        metrics,
      },
    });
  };
}
