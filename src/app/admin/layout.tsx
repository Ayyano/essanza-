'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, FolderTree, Truck, Users,
  Image, Tag, FileText, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: Truck },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, isAdmin, signOut } = useAuth()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (loading) return
    if (isLoginPage && isAdmin) {
      router.push('/admin')
      return
    }
    if (!isLoginPage && !isAdmin) {
      router.push('/admin/login')
    }
  }, [loading, isAdmin, isLoginPage, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C4A97D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C4A97D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F4] flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-[#1A1A1A] z-50 lg:translate-x-0 lg:static lg:z-auto',
          'flex flex-col border-r border-[#2D2D2D]'
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#2D2D2D]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-heading font-semibold text-[#C4A97D] tracking-wider">
              ESSANZA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-body">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-[#6B6B6B] hover:text-white lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm transition-colors font-body',
                  isActive
                    ? 'text-[#C4A97D] bg-[#C4A97D]/10 border-r-2 border-[#C4A97D]'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#2D2D2D]">
          <p className="text-[10px] text-[#6B6B6B] font-body">
            &copy; 2026 ESSANZA Admin
          </p>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E8DDD0] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#6B6B6B] hover:text-[#1A1A1A] lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm text-[#8A8A8A] font-body hidden sm:block">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-sm text-[#6B6B6B] font-body hidden md:block">
                {user.email}
              </span>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-red-400 transition-colors font-body"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  )
}
