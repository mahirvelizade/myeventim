'use client';

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideInRight' | 'scaleIn';
  delay?: number;
}

const animations = {
  fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  slideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
  slideInRight: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
  scaleIn: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
};

export function AnimatedContainer({
  children,
  className,
  animation = 'fadeIn',
  delay = 0,
}: AnimatedContainerProps) {
  const anim = animations[animation];
  return (
    <motion.div
      initial={anim.initial}
      animate={anim.animate}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
