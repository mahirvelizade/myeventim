import { prisma } from './prisma';
import { logger } from '@invitely/shared';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
}

const DEFAULT_FLAGS: Omit<FeatureFlag, 'key'> & { key: string }[] = [
  { key: 'png_generation', enabled: true, description: 'Enable PNG image generation' },
  { key: 'pdf_generation', enabled: false, description: 'Enable PDF generation' },
  { key: 'template_caching', enabled: true, description: 'Cache templates in memory' },
  { key: 'analytics_tracking', enabled: true, description: 'Track user analytics events' },
  { key: 'auto_save_drafts', enabled: true, description: 'Auto-save wizard drafts' },
  { key: 'maintenance_mode', enabled: false, description: 'Put system in maintenance mode' },
  { key: 'new_templates', enabled: true, description: 'Show newly added templates' },
  { key: 'broadcast_active', enabled: true, description: 'Allow broadcast messages to users' },
];

class FeatureFlagsService {
  private cache: Map<string, FeatureFlag> = new Map();
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      const existing = await prisma.featureFlag.findMany();
      const existingKeys = new Set(existing.map((f) => f.key));

      const toCreate = DEFAULT_FLAGS.filter((f) => !existingKeys.has(f.key));
      for (const flag of toCreate) {
        await prisma.featureFlag.create({ data: flag });
      }

      const all = await prisma.featureFlag.findMany();
      for (const flag of all) {
        this.cache.set(flag.key, flag);
      }
      this.initialized = true;
      logger.info(`Feature flags initialized: ${all.length} flags`);
    } catch (err) {
      logger.error('Failed to initialize feature flags', { error: String(err) });
      for (const flag of DEFAULT_FLAGS) {
        this.cache.set(flag.key, flag as FeatureFlag);
      }
      this.initialized = true;
    }
  }

  async isEnabled(key: string): Promise<boolean> {
    if (!this.initialized) await this.init();
    return this.cache.get(key)?.enabled ?? false;
  }

  async getAll(): Promise<FeatureFlag[]> {
    if (!this.initialized) await this.init();
    return Array.from(this.cache.values());
  }

  async setFlag(key: string, enabled: boolean): Promise<FeatureFlag | null> {
    if (!this.initialized) await this.init();
    const existing = this.cache.get(key);
    if (!existing) return null;

    try {
      const updated = await prisma.featureFlag.update({
        where: { key },
        data: { enabled },
      });
      this.cache.set(key, updated);
      return updated;
    } catch (err) {
      logger.error('Failed to update feature flag', { key, error: String(err) });
      return null;
    }
  }

  async createFlag(key: string, description: string, enabled = true): Promise<FeatureFlag | null> {
    try {
      const flag = await prisma.featureFlag.create({
        data: { key, description, enabled },
      });
      this.cache.set(key, flag);
      return flag;
    } catch (err) {
      logger.error('Failed to create feature flag', { key, error: String(err) });
      return null;
    }
  }

  isEnabledSync(key: string): boolean {
    return this.cache.get(key)?.enabled ?? false;
  }
}

export const featureFlags = new FeatureFlagsService();
