import type { InvitationStatus } from '../enums';

export interface Invitation {
  id: string;
  userId: string;
  categoryId: string;
  templateId: string;
  title: string;
  description: string | null;
  data: InvitationData;
  status: InvitationStatus;
  imageUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationData {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  hostName: string;
  guestName?: string;
  phone?: string;
  email?: string;
  dressCode?: string;
  additionalInfo?: string;
  coverImage?: string;
  customFields?: Record<string, string>;
}

export interface CreateInvitationInput {
  categoryId: string;
  templateId: string;
  title: string;
  description?: string;
  data: InvitationData;
}

export interface UpdateInvitationInput {
  title?: string;
  description?: string;
  data?: Partial<InvitationData>;
  status?: InvitationStatus;
  imageUrl?: string;
  pdfUrl?: string;
}
