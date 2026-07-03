import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { storageConfig } from '@invitely/config';
import type { UploadOptions, UploadResult, StorageFile } from '@invitely/types';
import { StorageService } from './storage.service';

export class LocalStorageService extends StorageService {
  private basePath: string;

  constructor(basePath?: string) {
    super();
    this.basePath = resolve(basePath ?? storageConfig.basePath);
    this.ensureDirectory('');
  }

  private ensureDirectory(subPath: string): void {
    const fullPath = join(this.basePath, subPath);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  private getFullPath(key: string): string {
    return join(this.basePath, this.sanitizeKey(key));
  }

  async upload(key: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult> {
    const sanitizedKey = this.sanitizeKey(key);
    const dir = sanitizedKey.split('/').slice(0, -1).join('/');
    this.ensureDirectory(dir);

    const fullPath = this.getFullPath(sanitizedKey);
    writeFileSync(fullPath, buffer);

    return {
      key: sanitizedKey,
      url: this.getUrl(sanitizedKey),
      size: buffer.length,
      mimeType: options?.mimeType ?? 'application/octet-stream',
    };
  }

  async download(key: string): Promise<Buffer> {
    const fullPath = this.getFullPath(key);
    return readFileSync(fullPath);
  }

  async delete(key: string): Promise<void> {
    const fullPath = this.getFullPath(key);
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
    }
  }

  getUrl(key: string): string {
    return `/storage/${this.sanitizeKey(key)}`;
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    const searchPath = prefix ? join(this.basePath, prefix) : this.basePath;
    if (!existsSync(searchPath)) return [];

    const entries = readdirSync(searchPath, { recursive: true });
    const files: StorageFile[] = [];

    for (const entry of entries) {
      if (typeof entry !== 'string') continue;
      const fullPath = join(searchPath, entry);
      try {
        const stats = statSync(fullPath);
        if (stats.isFile()) {
          files.push({
            key: entry,
            url: this.getUrl(entry),
            size: stats.size,
            mimeType: 'application/octet-forward',
            createdAt: stats.birthtime.toISOString(),
          });
        }
      } catch {
        continue;
      }
    }

    return files;
  }

  async exists(key: string): Promise<boolean> {
    return existsSync(this.getFullPath(key));
  }
}
