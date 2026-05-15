'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products } from '@/lib/products';
import { categories } from '@/lib/categories';
import { ProductGrid } from '@/components/ui/ProductGrid';

const SORT_OPTIONS = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export default function TrendingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  const trendingProducts = useMemo(() => products.filter(p => p.isTrending), []);

  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return trendingProducts;
    return trendingProducts.filter(p => p.category === selectedCategory);
  }, [trendingProducts, selectedCategory]);

  const filteredProducts = useMemo(() => {
    const result = [...categoryProducts];
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case 'price-desc': return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return b.reviewCount - a.reviewCount;
      }
    });
    return result;
  }, [categoryProducts, sortBy]);

  const availableCategories = useMemo(() => {
    const cats = [...new Set(trendingProducts.map(p => p.category))];
    return categories.filter(c => cats.includes(c.name));
  }, [trendingProducts]);

  return (
    <div className="min-h-screen bg-warm-white">
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-matte-black to-deep-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: 'radial-gradient(ellipse at top right, #D97706 0%, transparent 60%)' }} />
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-600/20 border border-amber-600/30 mb-6"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs text-amber-300 font-medium uppercase tracking-wider">Most Wanted</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-warm-white tracking-tight">
              Trending
            </h1>
            <p className="text-base sm:text-lg text-gray-400 italic font-light mt-3 max-w-xl mx-auto">
              Jo sab le rahe hain
            </p>
            <div className="h-0.5 w-16 bg-muted-gold rounded-full mx-auto mt-4" />
          </motion.div>
        </div>
      </section>

      <nav className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto py-4 flex items-center gap-2 text-xs text-gray-400 border-b border-gray-100">
        <Link href="/" className="hover:text-muted-gold transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-muted-gold">Trending</span>
      </nav>

      <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'flex-shrink-0 whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                !selectedCategory
                  ? 'bg-matte-black text-warm-white'
                  : 'bg-soft-beige text-gray-600 hover:bg-gray-200'
              )}
            >
              All
            </button>
            {availableCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  'flex-shrink-0 whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                  selectedCategory === cat.name
                    ? 'bg-matte-black text-warm-white'
                    : 'bg-soft-beige text-gray-600 hover:bg-gray-200'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 hidden sm:block">Sort by</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-muted-gold focus:border-muted-gold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m4%206%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400 mb-6"
        >
          <span className="font-medium text-matte-black">{filteredProducts.length}</span> Trending Products
        </motion.p>

        <ProductGrid
          products={filteredProducts}
          emptyMessage="Koi trending products nahi"
          emptyDescription="Jald hi a rahe hain"
        />
      </div>
    </div>
  );
}
