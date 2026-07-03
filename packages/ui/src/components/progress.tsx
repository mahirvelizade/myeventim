'use client';

import { cn } from '../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn('h-full w-full flex-1 rounded-full bg-primary transition-all duration-300', indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
