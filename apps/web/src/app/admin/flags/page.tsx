'use client';

import { useEffect, useState } from 'react';
import { ToggleLeft, ToggleRight, Loader, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadFlags = () => {
    setLoading(true);
    adminApi.flags
      .list()
      .then((res) => setFlags(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const toggleFlag = async (key: string, current: boolean) => {
    setToggling(key);
    try {
      const res = await adminApi.flags.update(key, !current);
      setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, enabled: res.data.enabled } : f)));
    } catch {}
    finally { setToggling(null); }
  };

  const groupColors: Record<string, string> = {
    png_generation: 'bg-blue-500/10 border-blue-500/20',
    pdf_generation: 'bg-purple-500/10 border-purple-500/20',
    template_caching: 'bg-emerald-500/10 border-emerald-500/20',
    analytics_tracking: 'bg-cyan-500/10 border-cyan-500/20',
    auto_save_drafts: 'bg-indigo-500/10 border-indigo-500/20',
    maintenance_mode: 'bg-red-500/10 border-red-500/20',
    new_templates: 'bg-amber-500/10 border-amber-500/20',
    broadcast_active: 'bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{flags.length} feature flags</p>
        <button onClick={loadFlags}
          className="rounded-lg border border-gray-700 p-1.5 text-gray-400 hover:bg-gray-800">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {flags.map((flag) => {
            const colorClass = groupColors[flag.key] || 'bg-gray-900 border-gray-800';
            return (
              <div key={flag.key} className={`rounded-xl border p-4 ${colorClass}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-mono text-sm font-medium text-gray-200">{flag.key}</p>
                    {flag.description && (
                      <p className="mt-1 text-xs text-gray-400">{flag.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFlag(flag.key, flag.enabled)}
                    disabled={toggling === flag.key}
                    className={`ml-3 flex-shrink-0 transition-colors ${
                      flag.enabled ? 'text-rose-400' : 'text-gray-600'
                    } hover:${flag.enabled ? 'text-rose-300' : 'text-gray-400'}`}
                  >
                    {toggling === flag.key ? (
                      <Loader className="h-6 w-6 animate-spin" />
                    ) : flag.enabled ? (
                      <ToggleRight className="h-6 w-6" />
                    ) : (
                      <ToggleLeft className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <div className="mt-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    flag.enabled
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
