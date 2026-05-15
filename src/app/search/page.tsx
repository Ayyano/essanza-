'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products } from '@/lib/products';
import { categories } from '@/lib/categories';
import { ProductCard } from '@/components/ui';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [localQuery, setLocalQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    let filtered = products;

    const q = queryParam.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCategory && activeCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    return filtered;
  }, [queryParam, activeCategory]);

  const allCategories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    []
  );

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mb-2">Search Results</h1>
          <p className="text-gray-400 italic text-sm">
            {queryParam
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${queryParam}"`
              : 'ESSANZA mein kya dhundh rahe hain?'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const params = new URLSearchParams(window.location.search);
                params.set('q', localQuery);
                window.history.replaceState(null, '', `?${params.toString()}`);
                window.location.reload();
              }
            }}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-brand-200 bg-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8"
        >
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border',
                activeCategory === cat
                  ? 'bg-matte-black text-warm-white border-matte-black'
                  : 'bg-white text-gray-500 border-brand-200 hover:text-matte-black hover:border-matte-black'
              )}
            >
              {cat}
              {activeCategory === cat && <X className="h-3 w-3" />}
            </button>
          ))}
        </motion.div>

        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold text-matte-black mb-2">Koi Result Nahi Mila</h3>
            <p className="text-sm text-gray-400 mb-1">Aap ki search ke liye koi product nahi mila</p>
            <p className="text-xs text-gray-300 italic">
              Kuch aur keywords try karein — jaise &quot;lawn&quot;, &quot;kurta&quot;, &quot;earrings&quot; — ya category filter lagayein
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Search className="h-8 w-8 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
