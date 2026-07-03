import type { InvitationStatus } from '../enums';

export interface Draft {
  id: string;
  userId: string;
  categoryId: string | null;
  templateId: string | null;
  step: number;
  data: Record<string, unknown>;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDraftInput {
  userId: string;
  step?: number;
  data?: Record<string, unknown>;
}

export interface UpdateDraftInput {
  categoryId?: string | null;
  templateId?: string | null;
  step?: number;
  data?: Record<string, unknown>;
  status?: InvitationStatus;
}
