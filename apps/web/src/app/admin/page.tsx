'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Mail,
  Clock,
  FileText,
  TrendingUp,
  AlertTriangle,
  Activity,
  HardDrive,
} from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

interface DashboardData {
  users: { total: number; activeToday: number; activeThisWeek: number };
  invitations: { total: number; today: number; thisWeek: number };
  generationTime: { average: number; p50: number; p95: number };
  topTemplates: Array<{ id: string; name: string; slug: string; invitationCount: number; favoriteCount: number }>;
  categories: Array<{ id: string; name: string; slug: string; templateCount: number }>;
  system: { uptime: number; memoryUsage: number; dbConnections: number };
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.dashboard
      .get()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <AlertTriangle className="mb-2 h-8 w-8 text-red-400" />
        <p>Failed to load dashboard</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    {
      label: 'Total Users',
      value: data.users.total.toLocaleString(),
      sub: `${data.users.activeToday} active today`,
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      label: 'Invitations',
      value: data.invitations.total.toLocaleString(),
      sub: `${data.invitations.today} today`,
      icon: Mail,
      color: 'text-rose-400 bg-rose-500/10',
    },
    {
      label: 'Avg Generation',
      value: `${Math.round(data.generationTime.average / 1000)}s`,
      sub: `p95: ${Math.round(data.generationTime.p95 / 1000)}s`,
      icon: Clock,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'System',
      value: formatUptime(data.system.uptime),
      sub: `${data.system.memoryUsage}MB used`,
      icon: Activity,
      color: 'text-purple-400 bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-100">{card.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
                </div>
                <div className={`rounded-lg p-2.5 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-200">
            <TrendingUp className="h-4 w-4 text-rose-400" />
            Top Templates
          </h2>
          <div className="space-y-3">
            {data.topTemplates.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No templates used yet</p>
            )}
            {data.topTemplates.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="w-5 text-sm font-medium text-gray-500">#{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.slug}</p>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>{t.invitationCount} invites</span>
                  <span>{t.favoriteCount} favs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-200">
            <HardDrive className="h-4 w-4 text-rose-400" />
            Categories
          </h2>
          <div className="space-y-3">
            {data.categories.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No categories</p>
            )}
            {data.categories.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.slug}</p>
                </div>
                <span className="text-xs text-gray-400">{c.templateCount} templates</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
