'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, Heart, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  labelUrdu: string
  icon: React.ReactNode
  href: string
  count?: number
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    labelUrdu: 'Ghar',
    icon: <Home className="w-5 h-5" />,
    href: '/',
  },
  {
    label: 'Shop',
    labelUrdu: 'Dukaan',
    icon: <Grid3X3 className="w-5 h-5" />,
    href: '/category',
  },
  {
    label: 'Pasand',
    labelUrdu: 'Wishlist',
    icon: <Heart className="w-5 h-5" />,
    href: '/wishlist',
  },
  {
    label: 'Cart',
    labelUrdu: 'Toli',
    icon: <ShoppingBag className="w-5 h-5" />,
    href: '/cart',
    count: 3,
  },
  {
    label: 'Account',
    labelUrdu: 'Kharidari',
    icon: <User className="w-5 h-5" />,
    href: '/account',
  },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-warm-white/95 backdrop-blur-lg border-t border-soft-beige/60 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 min-w-0 py-1 px-2 rounded-xl transition-colors duration-200',
                isActive
                  ? 'text-muted-gold'
                  : 'text-matte-black/45 hover:text-matte-black/70'
              )}
            >
              <div className="relative">
                {item.icon}
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-muted-gold text-warm-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium tracking-wide',
                isActive ? 'opacity-100' : 'opacity-70'
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-muted-gold rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
