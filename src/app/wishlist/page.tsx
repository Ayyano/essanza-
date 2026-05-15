'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Share2,
  Trash2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { CartProvider, useCart } from '@/lib/store';
import { products } from '@/lib/products';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { CartItem } from '@/types';

function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-soft-beige flex items-center justify-center mb-6">
        <Heart className="h-9 w-9 text-muted-gold" />
      </div>
      <h2 className="text-2xl font-heading font-semibold text-matte-black mb-2">
        Apki pasand khali hai
      </h2>
      <p className="text-gray-400 text-sm max-w-xs mb-8">
        Jo pasand aaye use heart karein — apni wishlist banayein aur baad mein order karein!
      </p>
      <Link href="/trending">
        <Button variant="primary" size="lg">
          <Sparkles className="h-4 w-4" />
          Shop Trending
        </Button>
      </Link>
    </motion.div>
  );
}

function WishlistContent() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [shared, setShared] = useState(false);

  const handleAddToCart = (item: (typeof wishlist)[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.salePrice || item.price,
      image: item.image,
      quantity: 1,
    });
    toggleWishlist(item);
  };

  const handleShare = async () => {
    const text = `Meri ESSANZA wishlist:\n${wishlist
      .map((item) => `- ${item.name} (${formatPrice(item.salePrice || item.price)})`)
      .join('\n')}\n\nShop now: https://essanza.pk`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My ESSANZA Wishlist', text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <EmptyWishlist />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-matte-black">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-gold-dark hover:text-muted-gold transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {shared ? 'Copied!' : 'Share'}
              </span>
            </button>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-gold-dark hover:text-muted-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          {wishlist.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-brand-100/50"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-soft-beige">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <button
                  type="button"
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 text-red-500 hover:bg-white transition-colors backdrop-blur-sm"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="h-4 w-4 fill-red-500" />
                </button>
              </div>

              <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-matte-black leading-tight line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex items-center gap-2">
                  {item.salePrice ? (
                    <>
                      <span className="text-sm font-semibold text-matte-black">
                        {formatPrice(item.salePrice)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-matte-black">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className={cn(
                    'mt-auto w-full flex items-center justify-center gap-2',
                    'text-sm font-medium py-2.5 px-4 rounded-lg',
                    'bg-matte-black text-warm-white',
                    'hover:bg-deep-charcoal transition-colors'
                  )}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Add to Cart</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <CartProvider>
      <WishlistContent />
    </CartProvider>
  );
}
