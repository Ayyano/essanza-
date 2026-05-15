'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowLeft,
  CreditCard,
  MessageCircle,
  Tag,
  ShoppingBasket,
} from 'lucide-react';
import { CartProvider, useCart } from '@/lib/store';
import { getProductsByTag } from '@/lib/products';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { TrustBadges } from '@/components/ui/TrustBadges';
import type { Product } from '@/types';

const relatedProducts = getProductsByTag('trending').slice(0, 4);

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-soft-beige flex items-center justify-center mb-6">
        <ShoppingBasket className="h-9 w-9 text-muted-gold" />
      </div>
      <h2 className="text-2xl font-heading font-semibold text-matte-black mb-2">
        Apki toli khali hai
      </h2>
      <p className="text-gray-400 text-sm max-w-xs mb-8">
        Kuch pasand karein aur apni toli mein shamil karein — har cheez yahan hai!
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          <ShoppingBag className="h-4 w-4" />
          Shopping Shuru Karein
        </Button>
      </Link>
    </motion.div>
  );
}

const cartItemVariants = {
  initial: { opacity: 0, x: -20, height: 0 },
  enter: { opacity: 1, x: 0, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, x: 20, height: 0, transition: { duration: 0.2, ease: 'easeIn' as const } },
};

function CartContent() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    loading,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const deliveryFee = cartTotal >= 2000 ? 0 : 150;
  const total = cartTotal + deliveryFee;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-xl">
              <div className="w-20 h-24 bg-soft-beige rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-soft-beige rounded" />
                <div className="h-3 w-24 bg-soft-beige rounded" />
                <div className="h-3 w-16 bg-soft-beige rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-matte-black">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {cartCount} item{cartCount !== 1 ? 's' : ''} in apni toli
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-gold-dark hover:text-muted-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;
                const isWishlisted = isInWishlist(item.productId);

                return (
                  <motion.div
                    key={item.id}
                    variants={cartItemVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    layout
                    className="bg-white rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-5 shadow-sm border border-brand-100/50"
                  >
                    <Link
                      href={`/product/${item.productId}`}
                      className="shrink-0"
                    >
                      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-soft-beige">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/product/${item.productId}`}>
                            <h3 className="text-sm sm:text-base font-medium text-matte-black leading-tight hover:text-muted-gold-dark transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          {(item.size || item.color) && (
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {item.size && (
                                <span className="text-xs text-gray-400 bg-soft-beige px-2 py-0.5 rounded">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-xs text-gray-400 bg-soft-beige px-2 py-0.5 rounded">
                                  Color: {item.color}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3 sm:mt-0">
                        <div className="flex items-center gap-3">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(qty) => updateQuantity(item.id, qty)}
                            min={1}
                            max={10}
                            className="scale-[0.85] sm:scale-100 origin-left"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              toggleWishlist({
                                productId: item.productId,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                              });
                            }}
                            className={cn(
                              'p-1.5 rounded-full transition-colors',
                              isWishlisted
                                ? 'text-red-500 bg-red-50'
                                : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
                            )}
                            aria-label={
                              isWishlisted
                                ? 'Remove from wishlist'
                                : 'Add to wishlist'
                            }
                          >
                            <Heart
                              className={cn(
                                'h-4 w-4',
                                isWishlisted && 'fill-red-500'
                              )}
                            />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-matte-black">
                            {formatPrice(item.price)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              {formatPrice(lineTotal)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-gold-dark hover:text-muted-gold transition-colors mt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-brand-100/50 sticky top-24 space-y-5">
              <h2 className="text-lg font-heading font-semibold text-matte-black">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium text-matte-black">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span
                    className={cn(
                      'font-medium',
                      deliveryFee === 0
                        ? 'text-emerald-600'
                        : 'text-matte-black'
                    )}
                  >
                    {deliveryFee === 0
                      ? 'Free'
                      : formatPrice(deliveryFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-gray-300">
                    Free delivery on orders above {formatPrice(2000)}
                  </p>
                )}
                <div className="border-t border-brand-100 pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold text-matte-black">
                      Total
                    </span>
                    <span className="font-bold text-matte-black text-lg">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-soft-beige/60">
                  <Tag className="h-4 w-4 text-muted-gold shrink-0" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code dalain"
                    className="flex-1 bg-transparent text-sm text-matte-black placeholder:text-gray-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCouponApplied(true)}
                    className={cn(
                      'text-xs font-medium px-3 py-1 rounded-md transition-colors',
                      couponApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-matte-black text-warm-white hover:bg-deep-charcoal'
                    )}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-emerald-600">
                    Coupon applied! (demo only)
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Link href="/checkout">
                  <Button variant="primary" size="lg" className="w-full">
                    <CreditCard className="h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </Link>
                <a
                  href="https://wa.me/447444046103"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Order via WhatsApp
                  </Button>
                </a>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-300 pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure
                </span>
                <span>COD Available</span>
                <span>7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <TrustBadges className="max-w-2xl mx-auto" />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-matte-black mb-6">
              You May Also Like
            </h2>
            <ProductGrid
              products={relatedProducts}
              columns={{ mobile: 2, tablet: 3, desktop: 4 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartContent />
    </CartProvider>
  );
}
