'use client';

import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isCurrent && 'border-2 border-primary bg-background text-primary',
                  !isCompleted && !isCurrent && 'border-2 border-muted-foreground/30 text-muted-foreground',
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-xs font-medium',
                  isCurrent && 'text-primary',
                  isCompleted && 'text-muted-foreground',
                  !isCompleted && !isCurrent && 'text-muted-foreground/50',
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'mx-2 h-px flex-1 transition-colors duration-200',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/20',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export type { StepIndicatorProps };
