'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ChevronLeft, ChevronRight, MapPin, Clock,
  ShieldCheck, Truck, RotateCcw, MessageCircle, Eye, Ruler,
  Check, X, ShoppingBag, Zap, PackageSearch,
} from 'lucide-react';
import { cn, formatPrice, formatDiscount } from '@/lib/utils';
import { getRelatedProducts } from '@/lib/products';
import { useCart } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { StarRating } from '@/components/ui/StarRating';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/ui/ProductCard';
import type { Product } from '@/types';

const sampleReviews = [
  { id: 1, name: 'Ayesha Khan', location: 'Karachi', rating: 5, text: 'Mashallah! Bohot khoobsurat fabric hai. Color exactly jaisa website par tha. Delivery bhi time pe aa gayi. ESSANZA ka standard hamesha top class.', date: '2026-05-10' },
  { id: 2, name: 'Fatima Ali', location: 'Lahore', rating: 5, text: 'Quality aik dum zabardast hai. Main ne ghar walon ke liye bhi mangwaya hai. Sab bohot impressed hain. Roman Urdu mein description dekh ke accha laga — humari culture ka ehsaas.', date: '2026-05-08' },
  { id: 3, name: 'Sana Tariq', location: 'Islamabad', rating: 4, text: 'Fabric bohot soft hai aur embroidery ka kaam fine hai. Thoda late aaya par product value for money hai. Definitely recommend karti hoon.', date: '2026-05-05' },
  { id: 4, name: 'Zara Malik', location: 'Faisalabad', rating: 5, text: 'Pehli baar ESSANZA se mangwaya hai aur bohot khush hoon. Fit perfect hai aur stitching quality top class. COD ka option hai toh tension nahi. Next order bhi yahi se karoon gi.', date: '2026-05-02' },
  { id: 5, name: 'Hira Shah', location: 'Rawalpindi', rating: 4, text: 'Design waisa hi hai jaise photos mein dikh raha tha. Color combination bohot elegant hai. Ek dost ne bhi dekha toh woh bhi order karne wali hai. ESSANZA ka charm hi alag hai.', date: '2026-04-28' },
  { id: 6, name: 'Mahnoor Sheikh', location: 'Multan', rating: 5, text: 'Eid ke liye liya tha aur sab ne bohot tareef ki. Fabric ne garmi mein bhi comfort diya. Bina naap ke silwai bhi perfect aayi. Shukriya ESSANZA team!', date: '2026-04-20' },
];

const pakistaniCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Hyderabad', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot', 'Bahawalpur'];

const features = [
  'Premium quality fabric — mehsoos karein farq',
  'Digital printed design — jaise painter ne banaya ho',
  'Skin-friendly material — garmi mein bhi aaram',
  'Easy care — machine wash friendly',
  'Made in Pakistan — local craftsmanship ki misaal',
];

const careInstructions = [
  'Dry clean recommended for best results',
  'Iron on low-medium heat',
  'Store in cool dry place',
  'Avoid direct sunlight for long periods',
  'Separate dark colors before washing',
];

export default function ProductDetailClient({ product }: { product: Product | null }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const imageRef = useRef<HTMLDivElement>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [city, setCity] = useState('Karachi');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('essanza_recently');
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch {}
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0] || '',
      quantity,
      size: selectedSize || undefined,
      color: selectedColor ? product.colors?.find(c => c.hex === selectedColor)?.name : undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [product, addToCart, quantity, selectedSize, selectedColor]);

  const handleWishlist = useCallback(() => {
    if (!product) return;
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || '',
    });
  }, [product, toggleWishlist]);

  const wishlisted = product ? isInWishlist(product.id) : false;
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  const displayReviews = showAllReviews ? sampleReviews : sampleReviews.slice(0, 3);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center px-6">
          <PackageSearch className="h-16 w-16 text-muted-gold mx-auto mb-6" />
          <h1 className="text-2xl font-heading font-bold text-matte-black mb-3">
            Product nahi mila
          </h1>
          <p className="text-gray-400 mb-8">Yeh product exist nahi karta ya delete ho chuka hai.</p>
          <Link href="/">
            <Button variant="gold" size="lg">Wapas shop par jayein</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.onSale && product.salePrice
    ? formatDiscount(product.price, product.salePrice)
    : 0;

  const scarcity = {
    stock: Math.max(product.reviewCount % 30, 3),
    viewers: Math.floor((product.rating * 7 + product.reviewCount) % 30) + 8,
    soldToday: Math.floor(product.reviewCount / 3) + 5,
  };

  const whatsappText = `I'm%20interested%20in%20${encodeURIComponent(product.name)}`;
  const whatsappUrl = `https://wa.me/447444046103?text=${whatsappText}`;

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (city === 'Karachi' || city === 'Lahore' ? 3 : 5));

  const tagVariant = product.isNew ? 'new' : product.onSale ? 'sale' : product.isTrending ? 'trending' : undefined;

  return (
    <div className="min-h-screen bg-warm-white pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-muted-gold-dark transition-colors">Home</Link>
          <span>/</span>
          <Link
            href={`/shop/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-muted-gold-dark transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-matte-black font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-14">
          <div className="space-y-4">
            <div
              ref={imageRef}
              onMouseEnter={() => setImageZoom(true)}
              onMouseLeave={() => setImageZoom(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-soft-beige cursor-crosshair group"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={`${product.name} - ${selectedImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={imageZoom ? {
                    transform: 'scale(2)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  } : {}}
                />
              </AnimatePresence>

              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {tagVariant && <Badge variant={tagVariant} />}
                {discount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-sm">-{discount}%</span>
                )}
                {product.isTrending && (
                  <span className="bg-amber-600 text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm">Bestseller</span>
                )}
              </div>

              {product.images.length > 1 && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4 text-matte-black" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4 text-matte-black" />
                  </motion.button>
                </>
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={cn(
                  'absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-200',
                  wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-deep-charcoal hover:bg-white',
                  'backdrop-blur-sm shadow-sm'
                )}
              >
                <Heart className={cn('h-4 w-4', wishlisted && 'fill-red-500')} />
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              {product.images.length > 1 && (
                <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
                  {product.images.map((img, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        'relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200',
                        i === selectedImage ? 'border-muted-gold' : 'border-transparent opacity-70 hover:opacity-100'
                      )}
                    >
                      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              )}
              <div className="flex-shrink-0 text-xs text-gray-400 font-medium">
                {selectedImage + 1}/{product.images.length}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-gold-dark font-semibold">
                {product.subcategory}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-matte-black leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2.5">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-bold text-matte-black">{formatPrice(product.salePrice)}</span>
                    <span className="text-base text-gray-400 line-through">{formatPrice(product.price)}</span>
                    <span className="bg-red-600/10 text-red-600 text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-matte-black">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-gray-400">{product.rating.toFixed(1)}</span>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-muted-gold-dark hover:text-muted-gold transition-colors underline underline-offset-2"
              >
                {product.reviewCount} reviews
              </button>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Color: <span className="text-matte-black">
                    {selectedColor
                      ? product.colors.find((c) => c.hex === selectedColor)?.name || 'Select'
                      : 'Select'}
                  </span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color.hex}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color.hex)}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 transition-all duration-200',
                        selectedColor === color.hex ? 'border-matte-black scale-110' : 'border-gray-300 hover:border-gray-400'
                      )}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Size: <span className="text-matte-black">{selectedSize || 'Select'}</span>
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1 text-xs text-muted-gold-dark hover:text-muted-gold transition-colors underline underline-offset-2"
                  >
                    <Ruler className="h-3 w-3" /> Size Guide
                  </motion.button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-200',
                        selectedSize === size
                          ? 'bg-matte-black text-warm-white border-matte-black'
                          : 'bg-white text-matte-black border-gray-200 hover:border-matte-black hover:bg-soft-beige'
                      )}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                <QuantitySelector value={quantity} onChange={setQuantity} className="h-12" />
                <Button variant="gold" size="lg" className="flex-1 h-12 text-sm" onClick={handleAddToCart}>
                  <ShoppingBag className="h-4 w-4" /> {addedToCart ? 'Added!' : 'Add to Cart'}
                </Button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  className={cn(
                    'h-12 w-12 flex items-center justify-center rounded-lg border transition-all duration-200',
                    wishlisted
                      ? 'bg-red-50 text-red-500 border-red-200'
                      : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Heart className={cn('h-4 w-4', wishlisted && 'fill-red-500')} />
                </motion.button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 py-3 rounded-lg bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20 text-sm font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp — hum yahan hain madad ke liye
              </a>
            </div>

            <div className="bg-soft-beige rounded-xl p-4 sm:p-5 space-y-3">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> Deliver to
                  </p>
                  <button
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="flex items-center gap-1.5 text-sm font-medium text-matte-black hover:text-muted-gold-dark transition-colors"
                  >
                    {city}
                    <motion.span animate={{ rotate: showCityDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronLeft className="h-3 w-3 -rotate-90" />
                    </motion.span>
                  </button>
                </div>
                <AnimatePresence>
                  {showCityDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-44"
                    >
                      {pakistaniCities.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setCity(c); setShowCityDropdown(false); }}
                          className={cn(
                            'w-full text-left px-4 py-2.5 text-sm transition-colors',
                            c === city ? 'bg-soft-beige text-matte-black font-medium' : 'text-gray-600 hover:bg-soft-beige'
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-gold-dark" />
                <span className="text-gray-600">
                  Estimated delivery: <span className="font-semibold text-matte-black">
                    {estimatedDate.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Cash on Delivery available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-8 mb-12 py-4 px-5 bg-soft-beige/60 rounded-xl border border-brand-200/40">
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-muted-gold-dark" />
            <span className="text-gray-500"><strong className="text-matte-black">{scarcity.viewers}</strong> people viewing this</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-muted-gold-dark" />
            <span className="text-gray-500"><strong className="text-matte-black">{scarcity.soldToday}</strong> sold in last 24 hours</span>
          </div>
          {scarcity.stock <= 8 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-600 font-medium">Only {scarcity.stock} left in stock!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-lg font-heading font-bold text-matte-black mb-4">Description</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-muted-gold-dark font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2.5">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-muted-gold-dark font-semibold mb-3">Care Instructions</h3>
              <ul className="space-y-2.5">
                {careInstructions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-gold mt-1.5 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-soft-beige rounded-xl p-5 space-y-3">
              <h3 className="text-sm uppercase tracking-[0.15em] text-muted-gold-dark font-semibold">Delivery Information</h3>
              <div className="space-y-2.5 text-sm text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Truck className="h-4 w-4 text-muted-gold-dark flex-shrink-0" />
                  <span>Free shipping on orders above <strong>Rs. 3,000</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="h-4 w-4 text-muted-gold-dark flex-shrink-0" />
                  <span><strong>7-day</strong> easy return policy</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-muted-gold-dark flex-shrink-0" />
                  <span><strong>Cash on Delivery</strong> available across Pakistan</span>
                </div>
              </div>
            </div>
          </div>

          <div id="reviews" className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-matte-black">Reviews</h2>
              <Button variant="outline" size="sm" className="text-xs">Write a Review</Button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-soft-beige rounded-xl">
              <div className="text-center">
                <span className="text-3xl font-heading font-bold text-matte-black">{product.rating.toFixed(1)}</span>
                <StarRating rating={product.rating} size="sm" showCount={false} className="justify-center mt-1" />
              </div>
              <div className="h-12 w-px bg-brand-200/60" />
              <div className="text-sm text-gray-500">
                Based on <strong className="text-matte-black">{product.reviewCount}</strong> reviews
                <p className="text-xs text-gray-400 mt-0.5">Sab khareedar confirm buyers hain</p>
              </div>
            </div>

            <AnimatePresence>
              {displayReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="pb-5 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-muted-gold/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-muted-gold-dark">{review.name[0]}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-matte-black">{review.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{review.location}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" showCount={false} className="mb-2" />
                  <p className="text-sm text-gray-600 leading-relaxed italic">&ldquo;{review.text}&rdquo;</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {sampleReviews.length > 3 && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-medium text-muted-gold-dark hover:text-muted-gold transition-colors"
              >
                {showAllReviews ? 'Kam dikhayein' : `Aur ${sampleReviews.length - 3} reviews dikhayein`}
                <motion.span animate={{ rotate: showAllReviews ? 180 : 0 }}>
                  <ChevronLeft className="h-3 w-3 -rotate-90" />
                </motion.span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'Above Rs. 3,000' },
            { icon: ShieldCheck, title: 'COD Available', desc: 'Pay on delivery' },
            { icon: RotateCcw, title: '7-Day Returns', desc: 'Easy exchange' },
            { icon: MessageCircle, title: 'WhatsApp Support', desc: '24/7 assistance' },
          ].map((badge) => (
            <div key={badge.title} className="flex items-center gap-3 p-3.5 rounded-lg bg-soft-beige/60 border border-brand-200/30">
              <div className="w-9 h-9 rounded-full bg-muted-gold/10 flex items-center justify-center flex-shrink-0">
                <badge.icon className="h-4 w-4 text-muted-gold-dark" />
              </div>
              <div>
                <p className="text-xs font-semibold text-matte-black">{badge.title}</p>
                <p className="text-[10px] text-gray-400">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <SectionHeading title="People also bought" subtitle="Aur dekhein — jo milta hai ESSANZA par" />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {getRelatedProducts(product, 6).length > 0 ? (
              getRelatedProducts(product, 6).map((related) => (
                <div key={related.id} className="flex-shrink-0 w-[180px] sm:w-[220px]">
                  <ProductCard product={related} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic py-8">Is category mein aur products a rahe hain. Jald milte hain!</p>
            )}
          </div>
        </div>

        {recentlyViewed.length > 1 && (
          <div>
            <SectionHeading title="Recently Viewed" subtitle="Wapas dekhna chahein gi?" />
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
              {recentlyViewed.filter((p) => p.id !== product.id).slice(0, 5).map((item) => (
                <div key={item.id} className="flex-shrink-0 w-[180px] sm:w-[220px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 inset-x-0 z-40 bg-warm-white border-t border-gray-200 p-3 lg:hidden"
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex flex-col flex-shrink-0">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-matte-black">{formatPrice(product.salePrice)}</span>
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-matte-black">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-1">
            <QuantitySelector value={quantity} onChange={setQuantity} className="h-10" />
            <Button variant="gold" size="sm" className="flex-1 h-10 whitespace-nowrap text-xs" onClick={handleAddToCart}>
              <ShoppingBag className="h-3.5 w-3.5" /> {addedToCart ? 'Added!' : 'Add to Cart'}
            </Button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#25D366] text-white flex-shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeGuide(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-warm-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-warm-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-heading font-bold text-matte-black">Size Guide</h3>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowSizeGuide(false)}>
                  <X className="h-4 w-4 text-gray-400" />
                </motion.button>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-gray-500 italic">Aap ki perfect size dhundhne mein madad.</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-soft-beige">
                      <th className="text-left py-2.5 px-3 font-semibold text-matte-black">Size</th>
                      <th className="text-left py-2.5 px-3 font-semibold text-matte-black">Chest (in)</th>
                      <th className="text-left py-2.5 px-3 font-semibold text-matte-black">Waist (in)</th>
                      <th className="text-left py-2.5 px-3 font-semibold text-matte-black">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="py-2.5 px-3 font-medium">Small</td><td className="py-2.5 px-3 text-gray-600">36-38</td><td className="py-2.5 px-3 text-gray-600">30-32</td><td className="py-2.5 px-3 text-gray-600">42</td></tr>
                    <tr><td className="py-2.5 px-3 font-medium">Medium</td><td className="py-2.5 px-3 text-gray-600">38-40</td><td className="py-2.5 px-3 text-gray-600">32-34</td><td className="py-2.5 px-3 text-gray-600">43</td></tr>
                    <tr><td className="py-2.5 px-3 font-medium">Large</td><td className="py-2.5 px-3 text-gray-600">40-42</td><td className="py-2.5 px-3 text-gray-600">34-36</td><td className="py-2.5 px-3 text-gray-600">44</td></tr>
                    <tr><td className="py-2.5 px-3 font-medium">X-Large</td><td className="py-2.5 px-3 text-gray-600">42-44</td><td className="py-2.5 px-3 text-gray-600">36-38</td><td className="py-2.5 px-3 text-gray-600">45</td></tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-4">Measurements are approximate. Unstitched fabric: 2.5 meters standard.</p>
                <p className="text-xs text-gray-400">Apna tailor se bhi measurements check kar lena recommend karte hain.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
