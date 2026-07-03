'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, className, onValueChange }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'inline-flex h-11 items-center rounded-xl bg-muted p-1 text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.value === value;

  return (
    <button
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium transition-all',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:text-foreground/80',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;

  return <div className={cn('mt-4', className)}>{children}</div>;
}
