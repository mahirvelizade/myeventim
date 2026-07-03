import { prisma } from './prisma';
import { analyticsService } from './analytics.service';

interface DashboardData {
  users: { total: number; activeToday: number; activeThisWeek: number };
  invitations: { total: number; today: number; thisWeek: number };
  generationTime: { average: number; p50: number; p95: number };
  topTemplates: Array<{ id: string; name: string; slug: string; invitationCount: number; favoriteCount: number }>;
  categories: Array<{ id: string; name: string; slug: string; templateCount: number }>;
  system: { uptime: number; memoryUsage: number; dbConnections: number };
}

export const adminService = {
  async getDashboard(): Promise<DashboardData> {
    const [userStats, invStats, genTime, topTemplates, categories] = await Promise.all([
      analyticsService.getUserStats(),
      analyticsService.getInvitationStats(),
      analyticsService.getGenerationTimeStats(),
      analyticsService.getTemplateUsageStats(),
      prisma.invitationCategory.findMany({
        select: { id: true, name: true, slug: true, _count: { select: { templates: true } } },
        orderBy: { order: 'asc' },
      }),
    ]);

    return {
      users: userStats,
      invitations: { total: invStats.total, today: invStats.today, thisWeek: invStats.thisWeek },
      generationTime: genTime,
      topTemplates: topTemplates.slice(0, 10),
      categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, templateCount: c._count.templates })),
      system: {
        uptime: process.uptime(),
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        dbConnections: 1,
      },
    };
  },

  async getRecentLogs(limit = 100, type?: string, severity?: string, search?: string) {
    const where: Record<string, unknown> = {};
    if (type) where.action = type;
    if (search) where.OR = [{ action: { contains: search } }, { entityType: { contains: search } }];

    return prisma.auditLog.findMany({
      where: where as Parameters<typeof prisma.auditLog.findMany>[0]['where'],
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: { user: { select: { firstName: true, username: true } } },
    });
  },

  async getErrorLogs(limit = 50) {
    return prisma.auditLog.findMany({
      where: { action: { contains: 'ERROR' } },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  },
};
