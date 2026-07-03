'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end';
}

export function DropdownMenu({ trigger, children, align = 'start' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[8rem] rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in zoom-in-95',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}

// Alias exports for compatibility
const DropdownMenuTrigger = DropdownItem;
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('py-1', className)}>{children}</div>
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = DropdownItem;
DropdownMenuItem.displayName = 'DropdownMenuItem';

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownItem };
