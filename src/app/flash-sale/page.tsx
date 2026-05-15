'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, Zap, Package } from 'lucide-react';
import { formatPrice, formatDiscount } from '@/lib/utils';
import { products } from '@/lib/products';
import { FLASH_SALE_TIMER } from '@/lib/constants';
import { ProductGrid } from '@/components/ui/ProductGrid';

const SORT_OPTIONS = [
  { label: 'Biggest Discount', value: 'discount' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Popular', value: 'popular' },
];

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const end = new Date(FLASH_SALE_TIMER.endDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, end - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: 'Din', value: timeLeft.days },
    { label: 'Ghantay', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3">
      {units.map(unit => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-red-500/30 flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-white font-mono">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] text-red-300/70 mt-1 uppercase tracking-wider">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function FlashSalePage() {
  const [sortBy, setSortBy] = useState('discount');

  const saleProducts = useMemo(() => {
    return products.filter(p => p.onSale && p.salePrice);
  }, []);

  const sortedProducts = useMemo(() => {
    const result = [...saleProducts];
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case 'price-desc': return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case 'popular': return b.reviewCount - a.reviewCount;
        case 'discount':
        default: {
          const dA = a.salePrice ? formatDiscount(a.price, a.salePrice) : 0;
          const dB = b.salePrice ? formatDiscount(b.price, b.salePrice) : 0;
          return dB - dA;
        }
      }
    });
    return result;
  }, [saleProducts, sortBy]);

  return (
    <div className="min-h-screen bg-warm-white">
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-red-950 via-matte-black to-red-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.1]" style={{ background: 'radial-gradient(ellipse at top, #DC2626 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(196, 169, 125, 0.05) 0%, transparent 50%)',
        }} />
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 mb-6"
            >
              <Zap className="h-4 w-4 text-red-400" />
              <span className="text-xs text-red-300 font-medium uppercase tracking-wider">Limited Time Offers</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-warm-white tracking-tight">
              Flash <span className="text-red-400">Sale</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 italic font-light mt-3 max-w-xl">
              Limited time deals — jaldi karo, stock khatam honay wala hai
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8">
              <div>
                <p className="text-xs text-red-300 font-medium uppercase tracking-wider mb-2">{FLASH_SALE_TIMER.message}</p>
                <Countdown />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 border border-red-500/20">
                <Package className="h-4 w-4 text-red-400" />
                <span className="text-xs text-red-200">{saleProducts.length} deals live</span>
              </div>
            </div>

            <div className="h-0.5 w-16 bg-red-500 rounded-full mt-6" />
          </motion.div>
        </div>
      </section>

      <nav className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto py-4 flex items-center gap-2 text-xs text-gray-400 border-b border-gray-100">
        <Link href="/" className="hover:text-muted-gold transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-red-500 font-medium">Flash Sale</span>
      </nav>

      <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-red-400" />
            <p className="text-sm text-gray-500">
              <span className="font-medium text-matte-black">{sortedProducts.length}</span> Items on Sale
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 hidden sm:block">Sort by</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm bg-white border border-red-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m4%206%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Sale Product Cards (list view with deal details) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sortBy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12"
          >
            {sortedProducts.slice(0, 6).map((product, i) => {
              const discount = product.salePrice ? formatDiscount(product.price, product.salePrice) : 0;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="group flex gap-4 p-4 rounded-xl bg-white border border-red-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300"
                  >
                    <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-soft-beige">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                        -{discount}%
                      </div>
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-muted-gold-dark font-medium">{product.category}</p>
                      <h3 className="text-sm font-medium text-matte-black mt-0.5 line-clamp-2 leading-snug group-hover:text-muted-gold-dark transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        {product.salePrice && (
                          <span className="text-base font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                        )}
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                            style={{ width: `${Math.min(100, product.reviewCount)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-red-500 font-medium">
                          {product.reviewCount > 50 ? 'Limited stock' : 'Almost gone'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Full grid with remaining products */}
        {sortedProducts.length > 6 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6 pt-8 border-t border-gray-100"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-red-200 to-transparent" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">More Deals</span>
              <div className="h-px flex-1 bg-gradient-to-l from-red-200 to-transparent" />
            </motion.div>

            <ProductGrid
              products={sortedProducts.slice(6)}
              emptyMessage="Koi aur deals nahi"
              emptyDescription="Sab deals yahan dikh gayi hain"
            />
          </>
        )}

        {sortedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-soft-beige flex items-center justify-center mb-4">
              <Clock className="h-7 w-7 text-muted-gold" />
            </div>
            <p className="text-lg font-medium text-matte-black mb-1">Abhi koi sale nahi hai</p>
            <p className="text-sm text-gray-400">Jald hi naye deals a rahe hain</p>
          </div>
        )}
      </div>
    </div>
  );
}
