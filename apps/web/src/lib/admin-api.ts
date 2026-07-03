const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('invitely-admin-token');
}

export function setAdminToken(token: string): void {
  localStorage.setItem('invitely-admin-token', token);
}

export function clearAdminToken(): void {
  localStorage.removeItem('invitely-admin-token');
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err.error?.message || `API error: ${res.status}`);
  }

  return res.json();
}

export const adminApi = {
  login: async (password: string, telegramId?: string) =>
    adminRequest<{ success: boolean; data: { token: string } }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password, telegramId }),
    }),

  dashboard: {
    get: () => adminRequest<{ success: boolean; data: any }>('/api/admin/dashboard'),
  },

  users: {
    list: (page = 1, limit = 20, search?: string) =>
      adminRequest<{ success: boolean; data: any[]; meta: any }>(
        `/api/admin/users?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
      ),
    get: (id: string) => adminRequest<{ success: boolean; data: any }>(`/api/admin/users/${id}`),
    update: (id: string, data: any) =>
      adminRequest<{ success: boolean; data: any }>(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  invitations: {
    list: (page = 1, limit = 20, status?: string) =>
      adminRequest<{ success: boolean; data: any[]; meta: any }>(
        `/api/admin/invitations?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
      ),
  },

  templates: {
    list: (page = 1, limit = 50) =>
      adminRequest<{ success: boolean; data: any[]; meta: any }>(
        `/api/admin/templates?page=${page}&limit=${limit}`,
      ),
    create: (data: any) =>
      adminRequest<{ success: boolean; data: any }>('/api/admin/templates', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      adminRequest<{ success: boolean; data: any }>(`/api/admin/templates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      adminRequest<{ success: boolean }>(`/api/admin/templates/${id}`, { method: 'DELETE' }),
  },

  categories: {
    list: () => adminRequest<{ success: boolean; data: any[] }>('/api/admin/categories'),
    create: (data: any) =>
      adminRequest<{ success: boolean; data: any }>('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      adminRequest<{ success: boolean; data: any }>(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  logs: {
    list: (limit = 100, type?: string, severity?: string, search?: string) =>
      adminRequest<{ success: boolean; data: any[] }>(
        `/api/admin/logs?limit=${limit}${type ? `&type=${type}` : ''}${severity ? `&severity=${severity}` : ''}${search ? `&search=${search}` : ''}`,
      ),
    errors: (limit = 50) =>
      adminRequest<{ success: boolean; data: any[] }>(`/api/admin/logs/errors?limit=${limit}`),
  },

  broadcasts: {
    list: (page = 1, limit = 20) =>
      adminRequest<{ success: boolean; items: any[]; total: number }>(
        `/api/admin/broadcasts?page=${page}&limit=${limit}`,
      ),
    create: (data: any) =>
      adminRequest<{ success: boolean; data: any }>('/api/admin/broadcasts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    send: (id: string) =>
      adminRequest<{ success: boolean; data: any }>(`/api/admin/broadcasts/${id}/send`, {
        method: 'POST',
      }),
  },

  flags: {
    list: () => adminRequest<{ success: boolean; data: any[] }>('/api/feature-flags'),
    update: (key: string, enabled: boolean) =>
      adminRequest<{ success: boolean; data: any }>(`/api/feature-flags/${key}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled }),
      }),
  },
};
