'use client';

import { cn } from '../lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideInRight' | 'scaleIn';
  delay?: number;
}

export function AnimatedContainer({
  children,
  className,
}: AnimatedContainerProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}
