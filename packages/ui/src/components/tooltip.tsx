'use client';

import { useState, createContext, useContext, type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface TooltipContextValue {
  show: boolean;
  setShow: (v: boolean) => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function TooltipProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <TooltipContext.Provider value={{ show, setShow }}>
      {children}
    </TooltipContext.Provider>
  );
}

function Tooltip({ content, children, side = 'top' }: {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <TooltipProvider>
      <div
        className="relative inline-flex"
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
      >
        {children}
      </div>
    </TooltipProvider>
  );
}

function TooltipTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(TooltipContext);
  return (
    <div
      className={cn('inline-flex', className)}
      onMouseEnter={() => ctx?.setShow(true)}
      onMouseLeave={() => ctx?.setShow(false)}
      {...props}
    >
      {children}
    </div>
  );
}

function TooltipContent({ children, side = 'top', className }: {
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  const ctx = useContext(TooltipContext);
  if (!ctx?.show) return null;

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn(
        'absolute z-50 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background shadow-lg animate-in fade-in zoom-in-95 pointer-events-none',
        sideClasses[side],
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
