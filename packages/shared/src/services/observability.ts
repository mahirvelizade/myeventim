import { logger } from '../utils/logger';

interface Span {
  name: string;
  startTime: number;
  metadata: Record<string, unknown>;
}

interface MetricPoint {
  value: number;
  timestamp: number;
  tags: Record<string, string>;
}

interface RequestRecord {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  timestamp: number;
  userId?: string;
}

const activeSpans = new Map<string, Span>();
const metrics = new Map<string, MetricPoint[]>();
const MAX_METRICS = 1000;
const requestLog: RequestRecord[] = [];
const MAX_REQUESTS = 10000;

export const observability = {
  startSpan(name: string, metadata: Record<string, unknown> = {}): string {
    const id = `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    activeSpans.set(id, { name, startTime: performance.now(), metadata });
    return id;
  },

  endSpan(spanId: string, metadata: Record<string, unknown> = {}): void {
    const span = activeSpans.get(spanId);
    if (!span) {
      return;
    }
    const duration = performance.now() - span.startTime;
    activeSpans.delete(spanId);
    logger.debug(`Span: ${span.name}`, {
      durationMs: Math.round(duration * 100) / 100,
      ...span.metadata,
      ...metadata,
    });
  },

  recordMetric(name: string, value: number, tags: Record<string, string> = {}): void {
    if (!metrics.has(name)) {
      metrics.set(name, []);
    }
    const points = metrics.get(name)!;
    points.push({ value, timestamp: Date.now(), tags });
    if (points.length > MAX_METRICS) {
      points.splice(0, points.length - MAX_METRICS);
    }
  },

  getMetric(name: string, since = Date.now() - 3600000): MetricPoint[] {
    return (metrics.get(name) || []).filter((m) => m.timestamp >= since);
  },

  getAllMetricNames(): string[] {
    return Array.from(metrics.keys());
  },

  recordRequest(method: string, path: string, statusCode: number, durationMs: number, userId?: string): void {
    requestLog.push({ method, path, statusCode, durationMs, timestamp: Date.now(), userId });
    if (requestLog.length > MAX_REQUESTS) {
      requestLog.splice(0, requestLog.length - MAX_REQUESTS);
    }
    this.recordMetric('request_duration_ms', durationMs, { method, path, status: String(statusCode) });
  },

  getRequestStats(since = Date.now() - 3600000) {
    const recent = requestLog.filter((r) => r.timestamp >= since);
    const total = recent.length;
    const errors = recent.filter((r) => r.statusCode >= 500).length;
    const avgDuration = total > 0 ? recent.reduce((a, r) => a + r.durationMs, 0) / total : 0;

    const byPath: Record<string, { count: number; errors: number; avgDuration: number }> = {};
    for (const r of recent) {
      if (!byPath[r.path]) byPath[r.path] = { count: 0, errors: 0, avgDuration: 0 };
      byPath[r.path].count++;
      if (r.statusCode >= 500) byPath[r.path].errors++;
      byPath[r.path].avgDuration += r.durationMs;
    }
    for (const path of Object.keys(byPath)) {
      byPath[path].avgDuration = Math.round(byPath[path].avgDuration / byPath[path].count);
    }

    return { total, errors, avgDuration: Math.round(avgDuration), byPath };
  },

  captureError(error: Error, context: Record<string, unknown> = {}): void {
    logger.error(error.message, { errorName: error.name, stack: error.stack, ...context });
  },

  getSystemMetrics() {
    const mem = process.memoryUsage();
    return {
      memory: {
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
        rss: Math.round(mem.rss / 1024 / 1024),
        external: Math.round(mem.external / 1024 / 1024),
      },
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      activeSpans: activeSpans.size,
    };
  },

  initSentry(_dsn?: string): void {
    logger.info('Sentry integration placeholder - not configured');
  },
};
