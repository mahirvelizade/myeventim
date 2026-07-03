'use client';

import { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'solid';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const variantClasses = {
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'border border-border hover:bg-accent hover:text-accent-foreground',
  solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', variant = 'ghost', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
