'use client';

import { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}

const DialogContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-2xl border border-border bg-card p-6 shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
DialogContent.displayName = 'DialogContent';

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <X className="h-4 w-4" />
    </button>
  );
}

// Alias exports for compatibility
const DialogTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div onClick={onClick}>{children}</div>
);
DialogTrigger.displayName = 'DialogTrigger';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose };
