'use client';

import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={sheetRef}
        className={cn(
          'absolute bottom-0 left-0 right-0 z-10 rounded-t-2xl border border-border bg-card p-6 shadow-lg',
          'animate-in slide-in-from-bottom duration-300',
          'max-h-[85vh] overflow-y-auto',
          className,
        )}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
