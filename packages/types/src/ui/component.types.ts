import type { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface LoadingProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface DisabledProps {
  isDisabled?: boolean;
}

export interface SizeProps {
  size?: 'sm' | 'md' | 'lg';
}

export interface VariantProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}

export interface StepConfig {
  id: number;
  label: string;
  description?: string;
  icon?: string;
  isOptional?: boolean;
}

export interface WizardState {
  currentStep: number;
  steps: StepConfig[];
  data: Record<string, unknown>;
  errors: Record<string, string[]>;
  isSubmitting: boolean;
}

export interface ToastConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
