'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Shield, ShieldOff } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadUsers = () => {
    setLoading(true);
    adminApi.users
      .list(page, 20, search)
      .then((res) => {
        setUsers(res.data);
        setMeta(res.meta);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const toggleAdmin = async (id: string, current: boolean) => {
    await adminApi.users.update(id, { isAdmin: !current });
    loadUsers();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, username or Telegram ID..."
            className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="px-4 py-3 text-left font-medium text-gray-400">User</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">Telegram ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">Language</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Invitations</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Admin</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-200">{u.firstName} {u.lastName || ''}</p>
                    {u.username && <p className="text-xs text-gray-500">@{u.username}</p>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{u.telegramId}</td>
                  <td className="px-4 py-3 text-gray-400">{u.language}</td>
                  <td className="px-4 py-3 text-center text-gray-400">{u._count?.invitations || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAdmin(u.id, u.isAdmin)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        u.isAdmin
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                      }`}
                    >
                      {u.isAdmin ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                      {u.isAdmin ? 'Admin' : 'User'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages} ({meta.total} users)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:bg-gray-800 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPages}
              className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:bg-gray-800 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
