export interface InvitationCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  thumbnailUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  thumbnailUrl?: string;
  order?: number;
}
