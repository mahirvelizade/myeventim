import { z } from 'zod';
import { MAX_INVITATION_TITLE_LENGTH, MAX_INVITATION_DESCRIPTION_LENGTH, MAX_LOCATION_LENGTH } from '@invitely/types';

export const invitationDataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_INVITATION_TITLE_LENGTH),
  description: z.string().max(MAX_INVITATION_DESCRIPTION_LENGTH).optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required').max(MAX_LOCATION_LENGTH),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  hostName: z.string().min(1, 'Host name is required').max(100),
  guestName: z.string().max(100).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  dressCode: z.string().optional(),
  additionalInfo: z.string().max(MAX_INVITATION_DESCRIPTION_LENGTH).optional(),
  coverImage: z.string().optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});

export const createInvitationSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  templateId: z.string().min(1, 'Template is required'),
  title: z.string().min(1, 'Title is required').max(MAX_INVITATION_TITLE_LENGTH),
  description: z.string().max(MAX_INVITATION_DESCRIPTION_LENGTH).optional(),
  data: invitationDataSchema,
});

export const updateInvitationSchema = z.object({
  title: z.string().min(1).max(MAX_INVITATION_TITLE_LENGTH).optional(),
  description: z.string().max(MAX_INVITATION_DESCRIPTION_LENGTH).optional(),
  data: invitationDataSchema.partial().optional(),
  status: z.enum(['DRAFT', 'COMPLETED', 'ARCHIVED']).optional(),
});

export type InvitationDataInput = z.infer<typeof invitationDataSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
