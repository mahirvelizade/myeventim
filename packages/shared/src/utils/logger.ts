import { env } from '@invitely/config';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
  context?: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LOG_LEVELS[(env.LOG_LEVEL as LogLevel) ?? 'info'] ?? LOG_LEVELS.info;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= currentLevel;
}

function createEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta?.userId ? { userId: meta.userId } : {}),
    ...(meta?.requestId ? { requestId: meta.requestId } : {}),
    ...meta,
  };
}

function formatPretty(entry: LogEntry): string {
  const { level, message, timestamp, userId, requestId, ...rest } = entry;
  const parts = [
    `[${timestamp}]`,
    `[${level.toUpperCase().padEnd(5)}]`,
    message,
  ];
  if (userId) parts.push(`user=${userId}`);
  if (requestId) parts.push(`req=${requestId}`);
  const extra = Object.keys(rest).filter(
    (k) => !['level', 'message', 'timestamp', 'userId', 'requestId'].includes(k),
  );
  if (extra.length > 0) {
    parts.push(JSON.stringify(Object.fromEntries(extra.map((k) => [k, rest[k]]))));
  }
  return parts.join(' ');
}

const writer = {
  error: env.LOG_FORMAT === 'pretty' ? console.error : console.error,
  warn: env.LOG_FORMAT === 'pretty' ? console.warn : console.warn,
  info: env.LOG_FORMAT === 'pretty' ? console.info : console.info,
  debug: env.LOG_FORMAT === 'pretty' ? console.debug : console.debug,
};

export const logger = {
  error(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('error')) {
      const entry = createEntry('error', message, meta);
      writer.error(env.LOG_FORMAT === 'json' ? JSON.stringify(entry) : formatPretty(entry));
    }
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('warn')) {
      const entry = createEntry('warn', message, meta);
      writer.warn(env.LOG_FORMAT === 'json' ? JSON.stringify(entry) : formatPretty(entry));
    }
  },

  info(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('info')) {
      const entry = createEntry('info', message, meta);
      writer.info(env.LOG_FORMAT === 'json' ? JSON.stringify(entry) : formatPretty(entry));
    }
  },

  debug(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('debug')) {
      const entry = createEntry('debug', message, meta);
      writer.debug(env.LOG_FORMAT === 'json' ? JSON.stringify(entry) : formatPretty(entry));
    }
  },
};
