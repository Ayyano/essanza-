'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield, Truck, RotateCcw, Wallet,
  ChevronRight,
} from 'lucide-react'
interface FooterLink {
  name: string
  slug: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const columns: FooterColumn[] = [
  {
    title: 'Shop',
    links: [
      { name: 'Women', slug: '/category/women' },
      { name: 'Men', slug: '/category/men' },
      { name: 'Kids', slug: '/category/kids' },
      { name: 'Beauty', slug: '/category/beauty' },
      { name: 'Home', slug: '/category/home' },
      { name: 'Electronics', slug: '/category/electronics' },
      { name: 'Shoes', slug: '/category/shoes' },
      { name: 'Accessories', slug: '/category/accessories' },
      { name: 'Lifestyle', slug: '/category/lifestyle' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'FAQ', slug: '/faq' },
      { name: 'Contact Us', slug: '/contact' },
      { name: 'Order Tracking', slug: '/order-tracking' },
      { name: 'Shipping Info', slug: '/shipping' },
      { name: 'Size Guide', slug: '/size-guide' },
      { name: 'WhatsApp Support', slug: 'https://wa.me/447444046103' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', slug: '/about' },
      { name: 'Our Story', slug: '/our-story' },
      { name: 'Blog', slug: '/blog' },
      { name: 'Careers', slug: '/careers' },
      { name: 'Press', slug: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', slug: '/privacy' },
      { name: 'Terms of Service', slug: '/terms' },
      { name: 'Returns & Exchanges', slug: '/returns' },
      { name: 'Payment Security', slug: '/payment-security' },
    ],
  },
]

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
)

interface SocialLink {
  name: string
  icon: React.ReactNode
  href: string
}

const socialLinks: SocialLink[] = [
  { name: 'Facebook', icon: <FacebookIcon className="w-4 h-4" />, href: 'https://facebook.com/essanzapk' },
  { name: 'Instagram', icon: <InstagramIcon className="w-4 h-4" />, href: 'https://instagram.com/essanzapk' },
  { name: 'Twitter', icon: <TwitterIcon className="w-4 h-4" />, href: 'https://twitter.com/essanzapk' },
  { name: 'YouTube', icon: <YoutubeIcon className="w-4 h-4" />, href: 'https://youtube.com/@essanzapk' },
  { name: 'TikTok', icon: <TikTokIcon className="w-4 h-4" />, href: 'https://tiktok.com/@essanzapk' },
]

interface TrustBadge {
  icon: React.ReactNode
  label: string
  description: string
}

const trustBadges: TrustBadge[] = [
  { icon: <Wallet className="w-5 h-5" />, label: 'Cash on Delivery', description: 'Pay when you receive' },
  { icon: <Truck className="w-5 h-5" />, label: 'Nationwide Delivery', description: 'Across all Pakistan' },
  { icon: <RotateCcw className="w-5 h-5" />, label: 'Easy Returns', description: '7-day return policy' },
  { icon: <Shield className="w-5 h-5" />, label: 'Secure Checkout', description: '100% payment security' },
]

const paymentMethods = [
  'Visa', 'Mastercard', 'PayPak', 'JazzCash', 'Easypaisa', 'Bank Transfer',
]

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer className="bg-matte-black text-warm-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-14 sm:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs tracking-[0.2em] uppercase text-muted-gold font-medium mb-5">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.slug}>
                      <Link
                        href={link.slug}
                        className="text-sm text-warm-white/60 hover:text-muted-gold transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 sm:mt-20 pt-10 sm:pt-14 border-t border-warm-white/10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <h3 className="text-lg sm:text-xl font-serif text-warm-white tracking-wide mb-2">
                  Humari Newsletter
                </h3>
                <p className="text-sm text-warm-white/50 mb-5 max-w-md">
                  Sab se pehle jaaniye naye collections, exclusive deals aur offers ke baare mein.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Aapna email likhein"
                    required
                    className="flex-1 bg-warm-white/5 border border-warm-white/20 rounded-sm px-4 py-3 text-sm text-warm-white placeholder-warm-white/30 outline-none focus:border-muted-gold transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    className="bg-muted-gold hover:bg-muted-gold-dark text-warm-white text-sm font-medium px-5 py-3 rounded-sm transition-colors duration-200 whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-14">
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-muted-gold font-medium mb-4">
                    Follow us
                  </h4>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-warm-white/5 hover:bg-muted-gold/20 text-warm-white/60 hover:text-muted-gold flex items-center justify-center transition-all duration-200"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-muted-gold font-medium mb-4">
                    Baat cheet
                  </h4>
                  <div className="space-y-3 text-sm">
                    <a
                      href="https://wa.me/447444046103"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-warm-white/60 hover:text-muted-gold transition-colors"
                    >
                      <ChevronRight className="w-3 h-3" />
                      7440 046103
                    </a>
                    <a
                      href="mailto:essenza0055@gmail.com"
                      className="flex items-center gap-2 text-warm-white/60 hover:text-muted-gold transition-colors"
                    >
                      <ChevronRight className="w-3 h-3" />
                      essenza0055@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-14 pt-10 sm:pt-14 border-t border-warm-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted-gold/10 flex items-center justify-center shrink-0 text-muted-gold">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warm-white tracking-wide">
                      {badge.label}
                    </p>
                    <p className="text-[11px] text-warm-white/40 mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-warm-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-warm-white/30">
                Hum accept karte hain
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="text-[11px] tracking-wide text-warm-white/50 bg-warm-white/5 px-3 py-1.5 rounded-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-warm-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-warm-white/40 tracking-wide">
              &copy; {new Date().getFullYear()} ESSANZA &mdash; Har style ka apna ESSANZA
            </p>
            <p className="text-[10px] text-warm-white/25 tracking-wider uppercase">
              Zindagi mein rang bharo, ESSANZA ke saath
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
