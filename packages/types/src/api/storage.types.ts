export interface StorageConfig {
  driver: string;
  basePath?: string;
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

export interface StorageFile {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface UploadOptions {
  mimeType?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
}
