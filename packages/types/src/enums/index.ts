export enum InvitationStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export enum Language {
  AZ = 'az',
  EN = 'en',
}

export enum StorageDriver {
  LOCAL = 'local',
  S3 = 's3',
  R2 = 'r2',
  SUPABASE = 'supabase',
}

export enum GenerationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  GENERATE = 'GENERATE',
  DOWNLOAD = 'DOWNLOAD',
  SHARE = 'SHARE',
  LOGIN = 'LOGIN',
}

export enum AnalyticsEventType {
  INVITATION_CREATED = 'INVITATION_CREATED',
  INVITATION_GENERATED = 'INVITATION_GENERATED',
  INVITATION_DOWNLOADED = 'INVITATION_DOWNLOADED',
  TEMPLATE_SELECTED = 'TEMPLATE_SELECTED',
  CATEGORY_SELECTED = 'CATEGORY_SELECTED',
  THEME_CHANGED = 'THEME_CHANGED',
  LANGUAGE_CHANGED = 'LANGUAGE_CHANGED',
  DRAFT_SAVED = 'DRAFT_SAVED',
  APP_OPENED = 'APP_OPENED',
}
