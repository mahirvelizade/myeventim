import { env } from './env';

export interface StorageConfig {
  driver: 'local' | 's3' | 'r2' | 'supabase';
  basePath: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
}

export const storageConfig: StorageConfig = {
  driver: env.STORAGE_DRIVER as StorageConfig['driver'],
  basePath: env.STORAGE_PATH,
  maxFileSize: 10 * 1024 * 1024,
  allowedMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
  ],
};
