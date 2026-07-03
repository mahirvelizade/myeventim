'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi.invitations
      .list(page, 20, statusFilter || undefined)
      .then((res) => {
        setInvitations(res.data);
        setMeta(res.meta);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300 focus:border-rose-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="px-4 py-3 text-left font-medium text-gray-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">User</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : invitations.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">No invitations found</td></tr>
            ) : (
              invitations.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/50">
                  <td className="px-4 py-3 font-medium text-gray-200">{inv.title}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {inv.user?.firstName || 'Unknown'}
                    {inv.user?.username && <> (@{inv.user.username})</>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      inv.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:bg-gray-800 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPages}
              className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:bg-gray-800 disabled:opacity-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
