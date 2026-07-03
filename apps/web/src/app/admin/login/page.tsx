'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { adminApi, setAdminToken } from '@/lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'password' | 'telegram'>('password');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (mode === 'password') {
        result = await adminApi.login(password, telegramId || undefined);
      } else {
        result = await adminApi.login('', telegramId);
      }
      setAdminToken(result.data.token);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
            <Shield className="h-8 w-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-400">Invitely Administration Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex gap-2 rounded-lg bg-gray-900 p-1">
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'password'
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setMode('telegram')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'telegram'
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Telegram ID
            </button>
          </div>

          {mode === 'password' ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 pr-10 text-sm text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Telegram ID</label>
              <input
                type="text"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                placeholder="Enter your Telegram ID"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
