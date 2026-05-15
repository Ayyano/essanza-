'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, MapPin, LogOut, ChevronRight, Mail, Phone, Clock, CheckCircle, Truck, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  items: number;
}

const sampleOrders: Order[] = [
  { id: 'ESSANZA-1042', date: '2026-05-12', total: 8490, status: 'delivered', items: 2 },
  { id: 'ESSANZA-1038', date: '2026-05-08', total: 12490, status: 'shipped', items: 1 },
  { id: 'ESSANZA-1025', date: '2026-04-28', total: 5490, status: 'processing', items: 3 },
  { id: 'ESSANZA-1012', date: '2026-04-15', total: 2990, status: 'cancelled', items: 1 },
];

const statusConfig: Record<string, { label: string; urdu: string; icon: typeof CheckCircle; color: string }> = {
  delivered: { label: 'Delivered', urdu: 'ڈیلیور ہو گیا', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
  shipped: { label: 'Shipped', urdu: 'بھیج دیا گیا', icon: Truck, color: 'text-blue-600 bg-blue-50' },
  processing: { label: 'Processing', urdu: 'پروسیس ہو رہا ہے', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  cancelled: { label: 'Cancelled', urdu: 'منسوخ کر دیا گیا', icon: Ban, color: 'text-red-600 bg-red-50' },
};

const tabs = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'details', label: 'My Details', icon: User },
  { id: 'addresses', label: 'My Addresses', icon: MapPin },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mb-3">Welcome Back</h1>
            <p className="text-gray-400 italic text-sm">Sign in to your ESSANZA account</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-brand-100 space-y-5"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-deep-charcoal">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="apka.email@example.com"
                className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-deep-charcoal">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm"
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-xs text-gray-400 text-center">
              Don&apos;t have an account?{' '}
              <button type="button" className="text-muted-gold-dark font-medium hover:underline">Create one</button>
            </p>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 text-xs text-gray-300 italic"
          >
            Demo: click Sign In to continue (sample account)
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mb-2">My Account</h1>
          <p className="text-gray-400 italic text-sm">Apna account manage karein</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 shrink-0"
          >
            <div className="bg-white rounded-2xl border border-brand-100 overflow-hidden">
              <div className="p-5 border-b border-brand-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted-gold/20 flex items-center justify-center">
                    <span className="font-heading font-bold text-muted-gold-dark text-lg">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-matte-black">Ayesha Khan</p>
                    <p className="text-xs text-gray-400">ayesha@email.com</p>
                  </div>
                </div>
              </div>
              <nav className="p-2 space-y-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                      activeTab === tab.id
                        ? 'bg-muted-gold/10 text-muted-gold-dark font-medium'
                        : 'text-gray-500 hover:text-matte-black hover:bg-soft-beige/50'
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
                <hr className="my-2 border-brand-100" />
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </nav>
            </div>
          </motion.aside>

          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-heading font-bold text-matte-black mb-6">My Orders</h2>
                  {sampleOrders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;
                    return (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        className="bg-white rounded-xl border border-brand-100 p-5 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-matte-black text-sm">{order.id}</span>
                              <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium', status.color)}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(order.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                              <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-matte-black">{formatPrice(order.total)}</p>
                            <span className="text-xs text-muted-gold-dark cursor-pointer hover:underline flex items-center gap-0.5 justify-end mt-1">
                              Details <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-heading font-bold text-matte-black mb-6">My Details</h2>
                  <div className="bg-white rounded-xl border border-brand-100 p-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                        <p className="text-sm font-medium text-matte-black">Ayesha Khan</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                        <p className="text-sm font-medium text-matte-black flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-gray-300" />
                          ayesha@email.com
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Phone</label>
                        <p className="text-sm font-medium text-matte-black flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-gray-300" />
                          +92 300 1234567
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Member Since</label>
                        <p className="text-sm font-medium text-matte-black">January 2026</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-brand-100">
                      <Button variant="outline" size="sm">Edit Details</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-heading font-bold text-matte-black mb-6">My Addresses</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Home', address: 'House 12, Street 5, DHA Phase 6, Karachi, Sindh 75500' },
                      { label: 'Work', address: '3rd Floor, Business Center, I.I. Chundrigar Road, Karachi' },
                    ].map((addr) => (
                      <motion.div
                        key={addr.label}
                        variants={itemVariants}
                        className="bg-white rounded-xl border border-brand-100 p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-gold-dark">{addr.label}</span>
                          <button className="text-xs text-gray-400 hover:text-matte-black transition-colors">Edit</button>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{addr.address}</p>
                      </motion.div>
                    ))}
                    <motion.button
                      variants={itemVariants}
                      className="bg-white rounded-xl border-2 border-dashed border-brand-200 p-5 flex items-center justify-center text-sm text-gray-400 hover:text-muted-gold-dark hover:border-muted-gold transition-colors"
                    >
                      + Add New Address
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
