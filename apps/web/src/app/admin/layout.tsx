'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  ScrollText,
  Send,
  Flag,
  BarChart3,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { getAdminToken, clearAdminToken } from '@/lib/admin-api';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/invitations', label: 'Invitations', icon: Mail },
  { href: '/admin/templates', label: 'Templates', icon: FileText },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
  { href: '/admin/broadcast', label: 'Broadcast', icon: Send },
  { href: '/admin/flags', label: 'Feature Flags', icon: Flag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else {
      setIsAuthed(!!token);
    }
    setLoading(false);
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthed) return null;

  const handleLogout = () => {
    clearAdminToken();
    router.replace('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-800 bg-gray-900 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-6">
          <Shield className="h-6 w-6 text-rose-500" />
          <span className="text-lg font-bold">Invitely Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-gray-800 bg-gray-900/50 px-6 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-200 lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-semibold">
            {NAV_ITEMS.find((i) => i.href === pathname)?.label || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
