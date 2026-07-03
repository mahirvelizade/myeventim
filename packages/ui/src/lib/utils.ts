import { cn as sharedCn } from '@invitely/shared';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Parameters<typeof sharedCn>) {
  return twMerge(sharedCn(...inputs));
}
