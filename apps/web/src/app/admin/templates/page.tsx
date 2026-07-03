'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    adminApi.templates
      .list(page, 50)
      .then((res) => {
        setTemplates(res.data);
        setMeta(res.meta);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditForm({
      name: t.name,
      description: t.description || '',
      isActive: t.isActive,
      isPremium: t.isPremium,
      metadata: JSON.stringify(t.metadata, null, 2),
    });
  };

  const saveEdit = async (id: string) => {
    const data: any = { ...editForm };
    try {
      data.metadata = JSON.parse(editForm.metadata);
    } catch {}
    await adminApi.templates.update(id, data);
    setEditingId(null);
    setLoading(true);
    adminApi.templates.list(page, 50).then((r) => { setTemplates(r.data); setMeta(r.meta); setLoading(false); });
  };

  const toggleActive = async (id: string, current: boolean) => {
    await adminApi.templates.update(id, { isActive: !current });
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !current } : t)));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="px-4 py-3 text-left font-medium text-gray-400">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">Category</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Premium</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : templates.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No templates</td></tr>
            ) : (
              templates.map((t) => (
                <tr key={t.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/50">
                  {editingId === t.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-200 focus:border-rose-500 focus:outline-none" />
                      </td>
                      <td className="px-4 py-3 text-gray-400">{t.category?.name || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            editForm.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-500'
                          }`}>
                          {editForm.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setEditForm({ ...editForm, isPremium: !editForm.isPremium })}
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            editForm.isPremium ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-800 text-gray-500'
                          }`}>
                          {editForm.isPremium ? 'Premium' : 'Free'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => saveEdit(t.id)}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600">
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-700">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-gray-200">{t.name}</td>
                      <td className="px-4 py-3 text-gray-400">{t.category?.name || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleActive(t.id, t.isActive)}
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            t.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-500'
                          }`}>
                          {t.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          t.isPremium ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {t.isPremium ? 'Premium' : 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => startEdit(t)}
                          className="rounded-lg bg-gray-800 p-1.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
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
