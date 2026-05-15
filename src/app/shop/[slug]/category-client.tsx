'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, RefreshCw, ChevronRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { products } from '@/lib/products';
import { ProductGrid } from '@/components/ui/ProductGrid';
import type { Category } from '@/types';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Popular', value: 'popular' },
];

const MIN_PRICE = Math.min(...products.map(p => p.salePrice ?? p.price));
const MAX_PRICE = Math.max(...products.map(p => p.price));

function getCategorySizes(categoryName: string): string[] {
  const catProducts = products.filter(p => p.category === categoryName);
  return [...new Set(catProducts.flatMap(p => p.sizes ?? []))].sort();
}

function getCategoryColors(categoryName: string) {
  const catProducts = products.filter(p => p.category === categoryName);
  return [...new Map(
    catProducts.flatMap(p => p.colors ?? []).map(c => [c.name, c])
  ).values()];
}

export function CategoryPageClient({ category }: { category: Category }) {
  const catProducts = useMemo(() => products.filter(p => p.category === category.name), [category.name]);
  const catSizes = useMemo(() => getCategorySizes(category.name), [category.name]);
  const catColors = useMemo(() => getCategoryColors(category.name), [category.name]);

  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...catProducts];

    if (selectedSubcategory) {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    result = result.filter(p => {
      const price = p.salePrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes?.some(s => selectedSizes.includes(s)));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors?.some(c => selectedColors.includes(c.name)));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case 'price-desc': return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case 'popular': return b.reviewCount - a.reviewCount;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [catProducts, selectedSubcategory, priceRange, selectedSizes, selectedColors, sortBy]);

  const displayProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || selectedSubcategory !== null || priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE;

  const clearAllFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedSubcategory(null);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const filterSidebar = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Price Range</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-matte-black">{formatPrice(priceRange[0])}</span>
          <span className="text-xs text-gray-300">—</span>
          <span className="text-sm font-medium text-matte-black">{formatPrice(priceRange[1])}</span>
        </div>
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-soft-beige" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-muted-gold/30"
            style={{
              left: `${((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
              right: `${100 - ((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500}
            value={priceRange[0]}
            onChange={e => setPriceRange(prev => [Math.min(Number(e.target.value), prev[1]), prev[1]])}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-muted-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500}
            value={priceRange[1]}
            onChange={e => setPriceRange(prev => [prev[0], Math.max(Number(e.target.value), prev[0])])}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-muted-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>
      </div>

      {catSizes.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Size</h3>
          <div className="flex flex-wrap gap-2">
            {catSizes.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  'px-3.5 py-2 text-xs font-medium rounded-md border transition-all duration-200',
                  selectedSizes.includes(size)
                    ? 'bg-matte-black text-warm-white border-matte-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-matte-black'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {catColors.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Color</h3>
          <div className="flex flex-wrap gap-3">
            {catColors.map(color => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all duration-200',
                  selectedColors.includes(color.name)
                    ? 'border-muted-gold scale-110 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button onClick={clearAllFilters} className="flex items-center gap-2 text-sm text-muted-gold-dark hover:text-muted-gold transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-white">
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-matte-black to-deep-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: 'radial-gradient(ellipse at top right, #C4A97D 0%, transparent 60%)' }} />
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-gray-500 mb-6"
          >
            <Link href="/" className="hover:text-muted-gold transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-muted-gold transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-gold">{category.name}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-warm-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 italic font-light mt-3 max-w-2xl leading-relaxed">
              {category.description}
            </p>
            <p className="text-xs text-muted-gold/60 mt-2">
              {filteredProducts.length} products available
            </p>
            <div className="h-0.5 w-16 bg-muted-gold rounded-full mt-4" />
          </motion.div>
        </div>
      </section>

      {category.subcategories.length > 1 && (
        <div className="border-b border-gray-100 bg-warm-white">
          <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto py-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={cn(
                  'flex-shrink-0 whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                  selectedSubcategory === null
                    ? 'bg-matte-black text-warm-white'
                    : 'bg-soft-beige text-gray-600 hover:bg-gray-200'
                )}
              >
                All {category.name}
              </button>
              {category.subcategories.map(sub => (
                <button
                  key={sub.slug}
                  onClick={() => setSelectedSubcategory(sub.name)}
                  className={cn(
                    'flex-shrink-0 whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                    selectedSubcategory === sub.name
                      ? 'bg-matte-black text-warm-white'
                      : 'bg-soft-beige text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto py-8 lg:py-12">
        <div className="flex gap-10 lg:gap-14">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="sticky top-28"
            >
              {filterSidebar}
            </motion.div>
          </aside>

          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between gap-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-soft-beige transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-muted-gold" />
                  )}
                </button>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-matte-black">{filteredProducts.length}</span> Products
                </p>
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

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-2 mb-6 overflow-hidden"
                >
                  <span className="text-xs text-gray-400">Filters:</span>
                  {selectedSubcategory && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-soft-beige text-gray-700">
                      {selectedSubcategory}
                      <button onClick={() => setSelectedSubcategory(null)} className="hover:text-red-500 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSizes.map(size => (
                    <span key={size} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-soft-beige text-gray-700">
                      {size}
                      <button onClick={() => setSelectedSizes(prev => prev.filter(s => s !== size))} className="hover:text-red-500 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedColors.map(color => {
                    const c = catColors.find(co => co.name === color);
                    return (
                      <span key={color} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-soft-beige text-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: c?.hex }} />
                        {color}
                        <button onClick={() => setSelectedColors(prev => prev.filter(c => c !== color))} className="hover:text-red-500 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <ProductGrid
              products={displayProducts}
              emptyMessage="Is category mein koi products nahi mile"
              emptyDescription="Dobara kisi aur filter ke saath dekhein"
            />

            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-12"
              >
                <button
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="px-8 py-3 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors duration-200"
                >
                  Load More ({filteredProducts.length - visibleCount} remaining)
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-warm-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="sticky top-0 bg-warm-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-heading font-semibold text-matte-black">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-soft-beige rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-6">{filterSidebar}</div>
              <div className="sticky bottom-0 bg-warm-white border-t border-gray-100 px-6 py-4">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-3 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
