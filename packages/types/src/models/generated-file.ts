export interface GeneratedFile {
  id: string;
  invitationId: string;
  userId: string;
  format: string;
  url: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface CreateGeneratedFileInput {
  invitationId: string;
  userId: string;
  format: string;
  url: string;
  size: number;
  width?: number | null;
  height?: number | null;
}
