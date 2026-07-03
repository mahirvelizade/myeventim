'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { cn } from '../lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-success/20 bg-success/5',
  error: 'border-destructive/20 bg-destructive/5',
  warning: 'border-warning/20 bg-warning/5',
  info: 'border-info/20 bg-info/5',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const duration = toast.duration ?? 4000;
    const timer = setTimeout(() => onRemove(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-in slide-in-from-right duration-300',
        colors[toast.type],
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>
        )}
      </div>
      <button onClick={() => onRemove(toast.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function toast({ type, title, description, duration }: Omit<Toast, 'id'>) {
  const ctx = useContext(ToastContext);
  if (ctx) {
    ctx.addToast({ type, title, description, duration });
  } else {
    console.warn('Toaster not mounted. Wrap your app with <Toaster>.');
  }
}
