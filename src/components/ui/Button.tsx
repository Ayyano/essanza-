'use client';

import { type ElementType } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-matte-black text-warm-white hover:bg-deep-charcoal active:bg-matte-black',
  outline:
    'border-2 border-matte-black text-matte-black hover:bg-matte-black hover:text-warm-white active:bg-deep-charcoal',
  ghost:
    'text-matte-black hover:bg-soft-beige active:bg-brand-200',
  gold:
    'bg-muted-gold text-warm-white hover:bg-muted-gold-dark active:bg-muted-gold',
};

const sizes = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-2.5 text-base gap-2',
  lg: 'px-8 py-3.5 text-lg gap-2.5',
} as const;

type ButtonBaseProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps<T extends ElementType = 'button'> = ButtonBaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonBaseProps | 'as'>;

export function Button<T extends ElementType = 'button'>({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  as,
  disabled,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';
  const isDisabled = disabled || loading;

  return (
    <motion.div
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      className={cn('inline-block', isDisabled && 'pointer-events-none')}
    >
      <Component
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-lg',
          'transition-colors duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className,
        )}
        {...(props as Record<string, unknown>)}
      >
        {loading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="inline-flex"
          >
            <Loader2 className="h-4 w-4" />
          </motion.span>
        )}
        {children}
      </Component>
    </motion.div>
  );
}
