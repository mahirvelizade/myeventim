export interface FavoriteTemplate {
  id: string;
  userId: string;
  templateId: string;
  createdAt: string;
}

export interface CreateFavoriteTemplateInput {
  userId: string;
  templateId: string;
}
