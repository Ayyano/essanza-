'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, formatDiscount } from '@/lib/utils';
import { useCart } from '@/lib/store';
import { Badge } from './Badge';
import { StarRating } from './StarRating';
import type { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({
  product,
  className,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0] || '',
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || '',
    });
  };

  const discount =
    product.onSale && product.salePrice
      ? formatDiscount(product.price, product.salePrice)
      : 0;

  const tagVariant = product.isNew
    ? 'new'
    : product.onSale
      ? 'sale'
      : product.isTrending
        ? 'trending'
        : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('group relative flex flex-col', className)}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-soft-beige rounded-lg"
      >
        <motion.img
          src={product.images[0]}
          alt={product.name}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {discount > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm"
          >
            -{discount}%
          </motion.span>
        )}

        {tagVariant && (
          <Badge
            variant={tagVariant}
            position="absolute"
            className="top-3 left-3"
          />
        )}

        <motion.button
          type="button"
          onClick={handleToggleWishlist}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'absolute top-3 right-3 z-10 p-2 rounded-full',
            'transition-colors duration-200',
            wishlisted
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-deep-charcoal opacity-0 group-hover:opacity-100',
            'hover:bg-white',
            'backdrop-blur-sm',
          )}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-all',
              wishlisted && 'fill-red-500',
            )}
          />
        </motion.button>

        {product.inStock && (
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 8,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
          >
            <motion.button
              type="button"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'bg-warm-white text-matte-black text-sm font-medium',
                'py-2.5 rounded-md',
                'transition-colors duration-200',
                'hover:bg-muted-gold hover:text-white',
                'pointer-events-auto',
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              {added ? 'Added!' : 'Add to Cart'}
            </motion.button>
          </motion.div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-medium uppercase tracking-wider bg-black/60 px-4 py-1.5 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-1.5 pt-3 px-0.5">
        <p className="text-[11px] uppercase tracking-wider text-muted-gold-dark font-medium">
          {product.category}
        </p>

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-matte-black leading-tight hover:text-muted-gold-dark transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-semibold text-matte-black">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-matte-black">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <StarRating rating={product.rating} count={product.reviewCount} />

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {product.colors.slice(0, 5).map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(color.hex);
                }}
                className={cn(
                  'h-3.5 w-3.5 rounded-full border transition-all duration-200',
                  selectedColor === color.hex
                    ? 'border-matte-black scale-110'
                    : 'border-gray-300 hover:border-gray-400',
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-400 ml-0.5">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
