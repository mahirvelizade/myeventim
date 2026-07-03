'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { Users, Mail, Clock, TrendingUp, Loader, AlertTriangle } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

const COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#be123c', '#9f1239', '#881337'];

interface DashboardData {
  users: { total: number; activeToday: number; activeThisWeek: number };
  invitations: { total: number; today: number; thisWeek: number };
  generationTime: { average: number; p50: number; p95: number };
  topTemplates: Array<{ id: string; name: string; slug: string; invitationCount: number; favoriteCount: number }>;
  categories: Array<{ id: string; name: string; slug: string; templateCount: number }>;
  system: { uptime: number; memoryUsage: number; dbConnections: number };
}

export default function AdminAnalyticsPage() {
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
        <Loader className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <AlertTriangle className="mb-2 h-8 w-8 text-red-400" />
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const templateChartData = data.topTemplates.slice(0, 10).map((t) => ({
    name: t.name.length > 15 ? t.name.slice(0, 15) + '...' : t.name,
    invitations: t.invitationCount,
    favorites: t.favoriteCount,
  }));

  const categoryChartData = data.categories.map((c) => ({
    name: c.name,
    value: c.templateCount,
  }));

  const genTimeData = [
    { name: 'Average', value: Math.round(data.generationTime.average / 1000) },
    { name: 'P50', value: Math.round(data.generationTime.p50 / 1000) },
    { name: 'P95', value: Math.round(data.generationTime.p95 / 1000) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2.5"><Users className="h-5 w-5 text-blue-400" /></div>
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-100">{data.users.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{data.users.activeToday} active today</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-rose-500/10 p-2.5"><Mail className="h-5 w-5 text-rose-400" /></div>
            <div>
              <p className="text-sm text-gray-400">Invitations</p>
              <p className="text-2xl font-bold text-gray-100">{data.invitations.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{data.invitations.today} today</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5"><Clock className="h-5 w-5 text-emerald-400" /></div>
            <div>
              <p className="text-sm text-gray-400">Avg Generation</p>
              <p className="text-2xl font-bold text-gray-100">{Math.round(data.generationTime.average / 1000)}s</p>
              <p className="text-xs text-gray-500">P95: {Math.round(data.generationTime.p95 / 1000)}s</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2.5"><TrendingUp className="h-5 w-5 text-purple-400" /></div>
            <div>
              <p className="text-sm text-gray-400">Active/Week</p>
              <p className="text-2xl font-bold text-gray-100">{data.users.activeThisWeek.toLocaleString()}</p>
              <p className="text-xs text-gray-500">users this week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-200">Top Templates by Usage</h3>
          {templateChartData.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={templateChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#e5e7eb', fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="invitations" name="Invitations" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="favorites" name="Favorites" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-200">Categories by Template Count</h3>
          {categoryChartData.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-200">Generation Time (seconds)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={genTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#e5e7eb' }}
              />
              <Bar dataKey="value" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-200">System Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-gray-300">{data.system.memoryUsage} MB</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800">
                <div
                  className="h-2 rounded-full bg-rose-500 transition-all"
                  style={{ width: `${Math.min((data.system.memoryUsage / 512) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-400">Uptime</span>
                <span className="text-gray-300">{Math.floor(data.system.uptime / 86400)}d {Math.floor((data.system.uptime % 86400) / 3600)}h</span>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-400">Database Connections</span>
                <span className="text-gray-300">{data.system.dbConnections}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
