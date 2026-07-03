import type { AnalyticsEventType, DeviceType } from '../enums';

export interface AnalyticsEvent {
  id: string;
  userId: string | null;
  eventType: AnalyticsEventType;
  categoryId: string | null;
  templateId: string | null;
  language: string | null;
  generationDuration: number | null;
  device: DeviceType | null;
  metadata: Record<string, unknown> | null;
  timestamp: string;
}

export interface CreateAnalyticsEventInput {
  userId?: string | null;
  eventType: AnalyticsEventType;
  categoryId?: string | null;
  templateId?: string | null;
  language?: string | null;
  generationDuration?: number | null;
  device?: DeviceType | null;
  metadata?: Record<string, unknown> | null;
}
