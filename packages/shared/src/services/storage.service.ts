import type { UploadOptions, UploadResult, StorageFile } from '@invitely/types';

export interface IStorageService {
  upload(key: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
  list(prefix?: string): Promise<StorageFile[]>;
  exists(key: string): Promise<boolean>;
}

export abstract class StorageService implements IStorageService {
  abstract upload(key: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult>;
  abstract download(key: string): Promise<Buffer>;
  abstract delete(key: string): Promise<void>;
  abstract getUrl(key: string): string;
  abstract list(prefix?: string): Promise<StorageFile[]>;
  abstract exists(key: string): Promise<boolean>;

  protected sanitizeKey(key: string): string {
    return key.replace(/^\/+|\/+$/g, '');
  }

  protected generateKey(prefix: string, filename: string): string {
    const timestamp = Date.now();
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${prefix}/${timestamp}-${safeFilename}`;
  }
}
