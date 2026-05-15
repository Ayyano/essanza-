'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const badgeVariants = {
  new: 'bg-emerald-600 text-white',
  sale: 'bg-red-600 text-white',
  trending: 'bg-amber-600 text-white',
  bestseller: 'bg-muted-gold text-white',
  default: 'bg-deep-charcoal text-warm-white',
} as const;

const badgeLabels: Record<string, string> = {
  new: 'New',
  sale: 'Sale',
  trending: 'Trending',
  bestseller: 'Best Seller',
  default: '',
};

type BadgeProps = {
  variant?: keyof typeof badgeVariants;
  label?: string;
  position?: 'absolute' | 'inline';
  className?: string;
};

export function Badge({
  variant = 'default',
  label,
  position = 'inline',
  className,
}: BadgeProps) {
  const displayLabel = label || badgeLabels[variant] || variant;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-sm',
        position === 'absolute' && 'absolute top-3 left-3 z-10',
        badgeVariants[variant],
        className,
      )}
    >
      {displayLabel}
    </motion.span>
  );
}
