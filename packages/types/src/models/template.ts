export interface InvitationTemplate {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  isPremium: boolean;
  isActive: boolean;
  metadata: TemplateMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateMetadata {
  orientation: 'portrait' | 'landscape';
  aspectRatio: string;
  backgroundColor: string;
  fontFamily: string;
  fontColor: string;
  accentColor: string;
  stickers?: string[];
  decorations?: string[];
  layout: string;
  fields: TemplateField[];
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'time' | 'textarea' | 'image';
  required: boolean;
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string;
}

export interface CreateTemplateInput {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  isPremium?: boolean;
  metadata: TemplateMetadata;
}
