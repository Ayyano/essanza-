'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Heart, ShoppingBag, User, Menu, X, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubCategory {
  name: string
  slug: string
}

interface NavCategory {
  name: string
  slug: string
  image: string
  subcategories: SubCategory[]
}

const categories: NavCategory[] = [
  {
    name: 'Women',
    slug: 'women',
    image: '',
    subcategories: [
      { name: 'Unstitched Fabric', slug: 'women/unstitched' },
      { name: 'Ready to Wear', slug: 'women/ready-to-wear' },
      { name: 'Kurtas & Shalwar Kameez', slug: 'women/kurtas' },
      { name: 'Dupattas & Shawls', slug: 'women/dupattas' },
      { name: 'Sarees', slug: 'women/sarees' },
      { name: 'Abayas & Hijabs', slug: 'women/abayas' },
      { name: 'Watches & Accessories', slug: 'women/accessories' },
    ],
  },
  {
    name: 'Men',
    slug: 'men',
    image: '',
    subcategories: [
      { name: 'Shalwar Kameez', slug: 'men/shalwar-kameez' },
      { name: 'Kurtas', slug: 'men/kurtas' },
      { name: 'Waistcoats', slug: 'men/waistcoats' },
      { name: 'Sherwanis', slug: 'men/sherwanis' },
      { name: 'Casual Wear', slug: 'men/casual' },
      { name: 'Watches & Accessories', slug: 'men/accessories' },
    ],
  },
  {
    name: 'Kids',
    slug: 'kids',
    image: '',
    subcategories: [
      { name: 'Boys', slug: 'kids/boys' },
      { name: 'Girls', slug: 'kids/girls' },
      { name: 'Baby', slug: 'kids/baby' },
    ],
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    image: '',
    subcategories: [
      { name: 'Makeup', slug: 'beauty/makeup' },
      { name: 'Skincare', slug: 'beauty/skincare' },
      { name: 'Haircare', slug: 'beauty/haircare' },
      { name: 'Fragrances', slug: 'beauty/fragrances' },
    ],
  },
  {
    name: 'Home',
    slug: 'home',
    image: '',
    subcategories: [
      { name: 'Bedding', slug: 'home/bedding' },
      { name: 'Dining', slug: 'home/dining' },
      { name: 'Home Decor', slug: 'home/decor' },
      { name: 'Kitchen', slug: 'home/kitchen' },
    ],
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    image: '',
    subcategories: [
      { name: 'Mobiles', slug: 'electronics/mobiles' },
      { name: 'Laptops', slug: 'electronics/laptops' },
      { name: 'Audio', slug: 'electronics/audio' },
      { name: 'Smart Wearables', slug: 'electronics/wearables' },
    ],
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    image: '',
    subcategories: [
      { name: "Women's Footwear", slug: 'shoes/women' },
      { name: "Men's Footwear", slug: 'shoes/men' },
      { name: "Kids' Footwear", slug: 'shoes/kids' },
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: '',
    subcategories: [
      { name: 'Watches', slug: 'accessories/watches' },
      { name: 'Jewelry', slug: 'accessories/jewelry' },
      { name: 'Bags', slug: 'accessories/bags' },
      { name: 'Sunglasses', slug: 'accessories/sunglasses' },
    ],
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    image: '',
    subcategories: [
      { name: 'Books', slug: 'lifestyle/books' },
      { name: 'Fitness', slug: 'lifestyle/fitness' },
      { name: 'Travel', slug: 'lifestyle/travel' },
      { name: 'Gifts', slug: 'lifestyle/gifts' },
    ],
  },
]

const navItems = categories.map(({ name, slug }) => ({ name, slug }))

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen, searchOpen])

  useEffect(() => {
    if (!activeMegaMenu) return
    const handleScroll = () => setActiveMegaMenu(null)
    window.addEventListener('scroll', handleScroll, { once: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeMegaMenu])

  const handleMenuEnter = useCallback((slug: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
    setActiveMegaMenu(slug)
  }, [])

  const handleMenuLeave = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => setActiveMegaMenu(null), 150)
  }, [])

  const cartItemCount = 3

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-warm-white/90 backdrop-blur-lg shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
            : 'bg-warm-white/0'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-matte-black select-none"
            >
              ESSANZA
            </Link>

            <nav className="hidden lg:flex items-center h-full">
              {navItems.map((item) => (
                <div
                  key={item.slug}
                  className="relative h-full"
                  onMouseEnter={() => handleMenuEnter(item.slug)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    href={`/category/${item.slug}`}
                    className={cn(
                      'flex items-center h-full px-[14px] text-[11px] tracking-[0.15em] uppercase transition-colors duration-200',
                      'text-matte-black/75 hover:text-matte-black'
                    )}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 w-2.5 h-2.5 text-matte-black/40" />
                  </Link>

                  <AnimatePresence>
                    {activeMegaMenu === item.slug && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-[640px] bg-warm-white shadow-2xl border border-soft-beige/60 rounded-b-lg overflow-hidden"
                        onMouseEnter={() => handleMenuEnter(item.slug)}
                        onMouseLeave={handleMenuLeave}
                      >
                        <div className="flex">
                          <div className="flex-1 p-7">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                              {categories
                                .find((c) => c.slug === item.slug)
                                ?.subcategories.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    href={`/category/${sub.slug}`}
                                    className="text-sm text-matte-black/65 hover:text-muted-gold transition-colors duration-200 py-1"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                            </div>
                            <Link
                              href={`/category/${item.slug}`}
                              className="inline-flex items-center gap-1 mt-5 text-[11px] font-medium text-muted-gold uppercase tracking-[0.15em] hover:text-muted-gold-dark transition-colors"
                            >
                              Dekhein Sare <span className="text-lg leading-none">→</span>
                            </Link>
                          </div>
                          <div className="w-44 bg-gradient-to-br from-soft-beige/80 to-warm-white flex items-center justify-center p-6">
                            <div className="w-full aspect-[3/4] bg-muted-gold-light/20 rounded-sm flex items-center justify-center border border-muted-gold-light/30">
                              <span className="text-[10px] text-muted-gold-dark/60 uppercase tracking-[0.2em] text-center leading-relaxed">
                                {item.name}
                                <br />
                                Collection
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-matte-black/60 hover:text-matte-black hover:bg-matte-black/5 transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <Link
                href="/wishlist"
                className="p-2.5 rounded-full text-matte-black/60 hover:text-matte-black hover:bg-matte-black/5 transition-colors duration-200 relative hidden sm:block"
                aria-label="Pasand (Wishlist)"
              >
                <Heart className="w-[18px] h-[18px]" />
              </Link>

              <Link
                href="/cart"
                className="p-2.5 rounded-full text-matte-black/60 hover:text-matte-black hover:bg-matte-black/5 transition-colors duration-200 relative"
                aria-label="Toli (Cart)"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-muted-gold text-warm-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="p-2.5 rounded-full text-matte-black/60 hover:text-matte-black hover:bg-matte-black/5 transition-colors duration-200 hidden sm:block"
                aria-label="Kharidari (Account)"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-full text-matte-black/60 hover:text-matte-black hover:bg-matte-black/5 transition-colors duration-200"
                aria-label="Menu"
              >
                <Menu className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-matte-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-warm-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
                <div className="flex items-center gap-4">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-matte-black/30 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder='Talash karein... Search products'
                    className="flex-1 bg-transparent border-none outline-none text-lg sm:text-xl text-matte-black placeholder-matte-black/25 font-light tracking-wide"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 text-matte-black/40 hover:text-matte-black transition-colors shrink-0"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 sm:mt-6 h-px bg-gradient-to-r from-transparent via-soft-beige to-transparent" />
                <p className="mt-3 text-xs text-matte-black/30 tracking-wide">
                  Press Enter to search or Escape to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-matte-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-warm-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-soft-beige/60">
                <span className="text-xl font-serif tracking-[0.25em] text-matte-black">
                  ESSANZA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-matte-black/50 hover:text-matte-black transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto h-[calc(100%-64px-72px)] px-4 py-4">
                <nav className="space-y-0.5">
                  {categories.map((cat) => (
                    <div key={cat.slug}>
                      <button
                        onClick={() =>
                          setMobileCategoryOpen(
                            mobileCategoryOpen === cat.slug ? null : cat.slug
                          )
                        }
                        className="flex items-center justify-between w-full py-3 px-3 text-sm font-medium text-matte-black/80 rounded-lg hover:bg-soft-beige/50 transition-colors"
                      >
                        {cat.name}
                        <motion.div
                          animate={{ rotate: mobileCategoryOpen === cat.slug ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-matte-black/30" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {mobileCategoryOpen === cat.slug && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 pl-3 border-l-2 border-soft-beige space-y-0.5 pb-2">
                              {cat.subcategories.map((sub) => (
                                <Link
                                  key={sub.slug}
                                  href={`/category/${sub.slug}`}
                                  className="block py-2 px-3 text-sm text-matte-black/55 hover:text-muted-gold transition-colors rounded-lg hover:bg-soft-beige/30"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                              <Link
                                href={`/category/${cat.slug}`}
                                className="block py-2 px-3 text-xs font-medium text-muted-gold tracking-wider uppercase mt-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Dekhein Sare →
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>
              </div>

              <div className="absolute bottom-0 left-0 right-0 border-t border-soft-beige/60 bg-warm-white px-4 py-4">
                <div className="flex items-center gap-4">
                  <Link
                    href="/account"
                    className="flex items-center gap-2.5 text-sm text-matte-black/70 hover:text-matte-black transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Kharidari
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2.5 text-sm text-matte-black/70 hover:text-matte-black transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Pasand
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
