'use client';

import { cn } from '../lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepIndicator({ currentStep, totalSteps, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isActive = step === currentStep
        const isDone = step < currentStep
        return (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              isActive && 'bg-primary',
              isDone && 'bg-primary/60',
              !isActive && !isDone && 'bg-border',
            )}
          />
        )
      })}
    </div>
  )
}
