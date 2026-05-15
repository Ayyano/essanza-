'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Camera,
  Mail,
  Star,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, formatDiscount } from '@/lib/utils';
import { heroBanners } from '@/lib/banners';
import { featuredCategories } from '@/lib/categories';
import { products, saleProducts } from '@/lib/products';
import { testimonials } from '@/lib/testimonials';
import { blogPosts } from '@/lib/blog';
import { FLASH_SALE_TIMER, SOCIAL_LINKS } from '@/lib/constants';
import { ProductCard, SectionHeading, TrustBadges } from '@/components/ui';
import type { Product } from '@/types';

function FadeInUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ staggerChildren: 0.1, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountdownTimer() {
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
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-lg sm:text-xl font-bold text-white font-mono">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-white/60 mt-1 uppercase tracking-wider">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const shopTheLookData = [
  {
    id: 'look-1',
    name: 'Royal ESSANZA',
    subtitle: 'Khawab 3-Piece + Gold Necklace + Clutch',
    image: '/images/MBM-3PW25-07MaroonBack_D.jpg',
    products: ['ESSANZA Khawab Digital Printed 3-Piece', 'ESSANZA Noor Gold-Plated Necklace', 'ESSANZA Clutch Evening Bag'],
  },
  {
    id: 'look-2',
    name: 'Mard Ka Style',
    subtitle: 'Badshah Kurta + Loafers + Watch',
    image: '/images/JTK_EF25_01_Multi_Color.jpg',
    products: ['ESSANZA Badshah Men Shalwar Kameez', 'ESSANZA Shoes Men Formal Loafers', 'ESSANZA Watch Classic Chronograph'],
  },
  {
    id: 'look-3',
    name: 'Modern Day Nawab',
    subtitle: 'Soldier Shirt + Sneakers + Sunglasses',
    image: '/images/D-14Front_A.jpg',
    products: ['ESSANZA Soldier Men Casual Shirt', 'ESSANZA Shoes Men Sneakers', 'ESSANZA Sunglasses Aviator'],
  },
];

const instagramImages = [
  '/images/MBM-3PW25-07MaroonBack_D.jpg',
  '/images/ca403492-4291-471c-b356-ab6df2875135.JPG',
  '/images/JTK_EF25_01_Multi_Color.jpg',
  '/images/78e955a7-4a60-4860-baf6-6aa19ad0271d.JPG',
  '/images/JSD056GreenOnyx.webp',
  '/images/mkd-ef21-23-blueb_4c223133-92d3-4ee2-9934-d20710246362.webp',
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const trendingRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 8);
  const saleItems = saleProducts.slice(0, 3);
  const latestPosts = blogPosts.slice(0, 3);
  const hero = heroBanners[0];

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingRef.current) {
      const scrollAmount = 320;
      trendingRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-warm-white overflow-hidden">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[70vh] sm:h-screen min-h-[600px] sm:min-h-[700px]">
        <div className="absolute inset-0">
          <img
            src={hero.image}
            alt={hero.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-muted-gold" />
              <span className="text-xs text-white/80 font-medium tracking-wider uppercase">Premium Lifestyle</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.1] tracking-tight"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-white/70 mt-4 max-w-lg font-light italic"
            >
              Jo dekha dil aa gaya
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm sm:text-base text-white/50 mt-2 max-w-xl leading-relaxed"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link
                href={hero.link}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-muted-gold text-white rounded-lg font-medium text-sm hover:bg-muted-gold-dark transition-colors duration-300 shadow-lg shadow-muted-gold/20"
              >
                {hero.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white rounded-lg font-medium text-sm hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm"
              >
                Explore Collection
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="py-20 sm:py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <FadeInUp>
          <SectionHeading
            title="Shop by Category"
            subtitle="Jahan dil kare, wahan le chalein"
            action={{ label: 'Sab Categories Dekhein', href: '/shop' }}
          />
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredCategories.map((cat) => (
            <StaggerItem key={cat.id}>
              <Link
                href={`/shop/${cat.slug}`}
                className="group relative block aspect-[4/5] rounded-xl overflow-hidden bg-soft-beige"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-white font-heading text-lg sm:text-xl font-semibold">{cat.name}</h3>
                  <p className="text-white/60 text-xs sm:text-sm mt-1">{cat.itemCount} Products</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="py-20 sm:py-24 bg-soft-beige/50">
        <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <FadeInUp>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-matte-black tracking-tight">
                  Trending
                </h2>
                <p className="text-sm text-gray-400 italic font-light mt-1">Jo sab le rahe hain</p>
                <div className="h-0.5 w-12 bg-muted-gold rounded-full mt-2" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollTrending('left')}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4 text-matte-black" />
                </button>
                <button
                  onClick={() => scrollTrending('right')}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <ChevronRight className="h-4 w-4 text-matte-black" />
                </button>
              </div>
            </div>
          </FadeInUp>
        </div>

        <div className="relative">
          <div
            ref={trendingRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide px-6 sm:px-12 lg:px-20 pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[260px] sm:w-[280px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-soft-beige/50 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* SHOP THE LOOK */}
      <section className="py-20 sm:py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <FadeInUp>
          <SectionHeading
            title="Shop the Look"
            subtitle="Poore outfit ka ek hi jagah intezaam"
            alignment="center"
          />
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {shopTheLookData.map((look) => (
            <StaggerItem key={look.id}>
              <Link href="/shop" className="group block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-soft-beige mb-4">
                  <img
                    src={look.image}
                    alt={look.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-heading text-xl font-semibold">{look.name}</h3>
                    <p className="text-white/60 text-xs mt-1">{look.subtitle}</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {look.products.map((name) => (
                    <span key={name} className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-muted-gold" />
                      {name}
                    </span>
                  ))}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* FLASH SALE */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-matte-black via-deep-charcoal to-matte-black text-white">
        <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <FadeInUp>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted-gold/20 border border-muted-gold/30 mb-4">
                  <Clock className="h-3.5 w-3.5 text-muted-gold" />
                  <span className="text-xs text-muted-gold font-medium uppercase tracking-wider">Limited Time</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight">
                  Flash Sale
                </h2>
                <p className="text-sm text-gray-400 italic font-light mt-1">Limited time deals — jaldi karo!</p>
                <div className="h-0.5 w-12 bg-muted-gold rounded-full mt-2" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-gold font-medium uppercase tracking-wider">{FLASH_SALE_TIMER.message}</p>
                <CountdownTimer />
              </div>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleItems.map((product) => {
              const discount = product.salePrice ? formatDiscount(product.price, product.salePrice) : 0;
              return (
                <StaggerItem key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {discount > 0 && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          -{discount}%
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-muted-gold/70 font-medium">
                        {product.category}
                      </p>
                      <h3 className="text-sm font-medium text-white mt-0.5 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        {product.salePrice && (
                          <span className="text-base font-bold text-muted-gold">
                            {formatPrice(product.salePrice)}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <FadeInUp>
          <TrustBadges />
        </FadeInUp>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-24 bg-soft-beige/50">
        <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
          <FadeInUp>
            <SectionHeading
              title="Kya Kehte Hain Log"
              subtitle="Sach much ke reviews, asli logon ki zabani"
              alignment="center"
            />
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t) => (
              <StaggerItem key={t.id}>
                <div className="p-6 rounded-xl bg-white border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-3.5 w-3.5',
                          i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{t.text}</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-soft-beige overflow-hidden flex-shrink-0">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-matte-black">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.location}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* INSTAGRAM / UGC */}
      <section className="py-20 sm:py-24">
        <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto mb-10">
          <FadeInUp>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted-gold/10 mb-4">
                <Camera className="h-6 w-6 text-muted-gold-dark" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-matte-black tracking-tight">
                Follow Us @essanza
              </h2>
              <p className="text-sm text-gray-400 italic font-light mt-1">Aap ka style, ESSANZA par</p>
              <div className="h-0.5 w-12 bg-muted-gold rounded-full mx-auto mt-2" />
            </div>
          </FadeInUp>
        </div>

        <StaggerContainer className="grid grid-cols-3 sm:grid-cols-6 gap-1 max-w-7xl mx-auto px-1">
          {instagramImages.map((img, i) => (
            <StaggerItem key={i}>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden bg-soft-beige"
              >
                <img
                  src={img}
                  alt={`ESSANZA Instagram ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 sm:py-24 bg-matte-black text-white">
        <div className="px-6 sm:px-12 lg:px-20 max-w-2xl mx-auto text-center">
          <FadeInUp>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted-gold/20 mb-4">
              <Mail className="h-5 w-5 text-muted-gold" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight">
              Become an ESSANZA Insider
            </h2>
            <p className="text-sm text-gray-400 italic font-light mt-2">Sab se pehle jaanein, sab se pehle paayein</p>
            <div className="h-0.5 w-12 bg-muted-gold rounded-full mx-auto mt-3" />
            <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Aap ka email address"
                required
                className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-muted-gold transition-colors duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-muted-gold text-white rounded-lg text-sm font-medium hover:bg-muted-gold-dark transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[11px] text-gray-500 mt-4">No spam, sirf exclusive deals aur updates</p>
          </FadeInUp>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-20 sm:py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <FadeInUp>
          <SectionHeading
            title="ESSANZA Stories"
            subtitle="Fashion, tips aur inspiration"
            action={{ label: 'Saare Articles', href: '/blog' }}
          />
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {latestPosts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-soft-beige mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{new Date(post.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-matte-black group-hover:text-muted-gold-dark transition-colors duration-200 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-gold-dark mt-1 group-hover:gap-2 transition-all duration-200">
                    Read More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 border-t border-gray-100">
        <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto text-center">
          <FadeInUp>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-matte-black">
              ESSANZA — Aap Ka Style, Aap Ki Pehchaan
            </h2>
            <p className="text-sm text-gray-400 italic mt-1">Har ek mein hai ek kahani</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors duration-200"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
