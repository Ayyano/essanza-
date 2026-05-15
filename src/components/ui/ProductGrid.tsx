'use client';

import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

type ProductGridProps = {
  products: Product[];
  columns?: { mobile?: number; tablet?: number; desktop?: number };
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
};

function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[3/4] bg-soft-beige rounded-lg" />
      <div className="flex flex-col gap-2 pt-3 px-0.5">
        <div className="h-3 w-16 bg-soft-beige rounded" />
        <div className="h-4 w-3/4 bg-soft-beige rounded" />
        <div className="h-4 w-1/3 bg-soft-beige rounded" />
        <div className="h-3 w-1/2 bg-soft-beige rounded" />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function ProductGrid({
  products,
  columns,
  loading = false,
  emptyMessage = 'Koi products nahi mile',
  emptyDescription = 'Is category mein abhi kuch nahi hai, dobara dekhein',
  className,
}: ProductGridProps) {
  const gridCols = {
    mobile: columns?.mobile ?? 2,
    tablet: columns?.tablet ?? 3,
    desktop: columns?.desktop ?? 4,
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${gridCols.mobile}, minmax(0, 1fr))`,
    ['@media (min-width: 640px)' as string]: {
      gridTemplateColumns: `repeat(${gridCols.tablet}, minmax(0, 1fr))`,
    },
    ['@media (min-width: 1024px)' as string]: {
      gridTemplateColumns: `repeat(${gridCols.desktop}, minmax(0, 1fr))`,
    },
  } satisfies React.CSSProperties;

  if (loading) {
    return (
      <div
        style={gridStyle}
        className={cn('grid gap-4 sm:gap-5 lg:gap-6', className)}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="w-16 h-16 rounded-full bg-soft-beige flex items-center justify-center mb-4">
          <PackageOpen className="h-7 w-7 text-muted-gold" />
        </div>
        <p className="text-lg font-medium text-matte-black mb-1">
          {emptyMessage}
        </p>
        <p className="text-sm text-gray-400 text-center max-w-xs">
          {emptyDescription}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={gridStyle}
      className={cn('grid gap-4 sm:gap-5 lg:gap-6', className)}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
