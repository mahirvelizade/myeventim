import type { InvitationData } from '@/store/use-app-store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('invitely-auth-token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  invitations: {
    list: (page = 1, limit = 20) =>
      request<{ success: boolean; data: InvitationData[]; meta: { total: number } }>(
        `/api/invitations?page=${page}&limit=${limit}`,
      ),
    get: (id: string) =>
      request<{ success: boolean; data: InvitationData }>(`/api/invitations/${id}`),
    create: (data: Partial<InvitationData>) =>
      request<{ success: boolean; data: InvitationData }>('/api/invitations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InvitationData>) =>
      request<{ success: boolean; data: InvitationData }>(`/api/invitations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/invitations/${id}`, { method: 'DELETE' }),
  },
  drafts: {
    get: () =>
      request<{ success: boolean; data: InvitationData | null }>('/api/drafts/current'),
    create: (data: Record<string, unknown>) =>
      request<{ success: boolean; data: InvitationData }>('/api/drafts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      request<{ success: boolean; data: InvitationData }>(`/api/drafts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
  categories: {
    list: () =>
      request<{ success: boolean; data: { id: string; name: string; slug: string }[] }>(
        '/api/categories',
      ),
  },
  templates: {
    list: (categoryId?: string) =>
      request<{ success: boolean; data: { id: string; name: string; metadata: string }[] }>(
        `/api/templates${categoryId ? `?categoryId=${categoryId}` : ''}`,
      ),
  },
  user: {
    me: () => request<{ success: boolean; data: { id: string; telegramId: string } }>('/api/users/me'),
  },
};
