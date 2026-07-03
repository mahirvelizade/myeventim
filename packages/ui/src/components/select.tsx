'use client';

import { useState, cloneElement, isValidElement, type ReactElement } from 'react';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}

function Select({ value, onValueChange, placeholder, children, className, error }: SelectProps) {
  const [open, setOpen] = useState(false);

  const childrenWithProps = isValidElement(children)
    ? cloneElement(children as ReactElement<{ onSelect?: (v: string) => void }>, {
        onSelect: (v: string) => {
          onValueChange(v);
          setOpen(false);
        },
      })
    : children;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          error && 'border-destructive',
          !value && 'text-muted-foreground',
          className,
        )}
      >
        <SelectValue value={value || placeholder || ''} placeholder={!value} />
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <SelectContent>
          {childrenWithProps}
        </SelectContent>
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectValue({ value, placeholder }: { value: string; placeholder?: boolean }) {
  return <span className={cn(placeholder && 'text-muted-foreground')}>{value || 'Seçin...'}</span>;
}

function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('absolute z-50 mt-1 w-full rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in zoom-in-95', className)}>
      {children}
    </div>
  );
}

function SelectTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SelectItem({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(value)}
      className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
