'use client';

import { cn } from '../lib/utils';

export function ScrollArea({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('overflow-y-auto scrollbar-thin', className)}
      {...props}
    >
      {children}
    </div>
  );
}
