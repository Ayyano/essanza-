'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div
      className={cn(
        'inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white',
        className,
      )}
    >
      <motion.button
        type="button"
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        whileTap={canDecrement ? { scale: 0.9 } : undefined}
        className={cn(
          'p-2.5 flex items-center justify-center transition-colors duration-150',
          canDecrement
            ? 'text-matte-black hover:bg-soft-beige'
            : 'text-gray-200 cursor-not-allowed',
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </motion.button>

      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-10 text-center text-sm font-medium text-matte-black select-none"
      >
        {value}
      </motion.span>

      <motion.button
        type="button"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        whileTap={canIncrement ? { scale: 0.9 } : undefined}
        className={cn(
          'p-2.5 flex items-center justify-center transition-colors duration-150',
          canIncrement
            ? 'text-matte-black hover:bg-soft-beige'
            : 'text-gray-200 cursor-not-allowed',
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  );
}
