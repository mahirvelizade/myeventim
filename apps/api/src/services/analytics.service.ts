import { prisma } from './prisma';

interface UserStats {
  total: number;
  activeToday: number;
  activeThisWeek: number;
}

interface InvitationStats {
  total: number;
  today: number;
  thisWeek: number;
  byCategory: Record<string, number>;
  byTemplate: Record<string, number>;
}

interface GenerationTimeStats {
  average: number;
  p50: number;
  p95: number;
}

export const analyticsService = {
  async getUserStats(): Promise<UserStats> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, activeToday, activeThisWeek] = await Promise.all([
      prisma.user.count(),
      prisma.analyticsEvent.count({
        where: { timestamp: { gte: todayStart } },
      }),
      prisma.analyticsEvent.count({
        where: { timestamp: { gte: weekStart } },
      }),
    ]);

    return { total, activeToday, activeThisWeek };
  },

  async getInvitationStats(): Promise<InvitationStats> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, today, thisWeek] = await Promise.all([
      prisma.invitation.count(),
      prisma.invitation.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.invitation.count({ where: { createdAt: { gte: weekStart } } }),
    ]);

    const categories = await prisma.invitation.groupBy({
      by: ['categoryId'],
      _count: true,
      orderBy: { _count: { categoryId: 'desc' } },
    });

    const templates = await prisma.invitation.groupBy({
      by: ['templateId'],
      _count: true,
      orderBy: { _count: { templateId: 'desc' } },
      take: 20,
    });

    const byCategory: Record<string, number> = {};
    for (const c of categories) {
      byCategory[c.categoryId] = c._count;
    }

    const byTemplate: Record<string, number> = {};
    for (const t of templates) {
      byTemplate[t.templateId] = t._count;
    }

    return { total, today, thisWeek, byCategory, byTemplate };
  },

  async getGenerationTimeStats(): Promise<GenerationTimeStats> {
    const durations = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'INVITATION_GENERATED',
        generationDuration: { not: null },
      },
      select: { generationDuration: true },
      orderBy: { generationDuration: 'asc' },
    });

    const values = durations
      .map((d) => d.generationDuration as number)
      .filter((d): d is number => d !== null)
      .sort((a, b) => a - b);

    if (values.length === 0) {
      return { average: 0, p50: 0, p95: 0 };
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const p50Index = Math.floor(values.length * 0.5);
    const p95Index = Math.floor(values.length * 0.95);

    return {
      average: Math.round(sum / values.length),
      p50: values[p50Index] ?? 0,
      p95: values[p95Index] ?? 0,
    };
  },

  async getTemplateUsageStats() {
    const templates = await prisma.invitationTemplate.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { invitations: true, favorites: true } },
      },
      orderBy: { invitations: { _count: 'desc' } },
      take: 50,
    });

    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      invitationCount: t._count.invitations,
      favoriteCount: t._count.favorites,
    }));
  },
};
