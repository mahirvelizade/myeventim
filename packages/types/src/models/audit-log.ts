import type { AuditAction } from '../enums';

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
}

export interface CreateAuditLogInput {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}
