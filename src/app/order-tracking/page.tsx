'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, ShoppingBag, Phone, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui';

interface TrackingStep {
  id: number;
  label: string;
  urdu: string;
  date: string;
  icon: typeof Package;
  completed: boolean;
  current: boolean;
}

const initialSteps: TrackingStep[] = [
  { id: 1, label: 'Order Placed', urdu: 'آرڈر ہو گیا', date: '12 May 2026, 3:42 PM', icon: ShoppingBag, completed: true, current: false },
  { id: 2, label: 'Confirmed', urdu: 'کنفرم ہو گیا', date: '12 May 2026, 5:20 PM', icon: CheckCircle2, completed: true, current: false },
  { id: 3, label: 'Shipped', urdu: 'بھیج دیا گیا', date: '13 May 2026, 10:15 AM', icon: Package, completed: true, current: false },
  { id: 4, label: 'Out for Delivery', urdu: 'ڈیلیوری پر چلا گیا', date: '15 May 2026, 8:30 AM', icon: Truck, completed: true, current: true },
  { id: 5, label: 'Delivered', urdu: 'ڈیلیور ہو گیا', date: '—', icon: MapPin, completed: false, current: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('ESSANZA-1042');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) setSearched(true);
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mb-2">Track Your Order</h1>
          <p className="text-gray-400 italic text-sm">Jaanein aap ka order abhi kahan hai</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="flex gap-3 mb-12"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID (e.g., ESSANZA-1042)"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-brand-200 bg-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm"
            />
          </div>
          <Button type="submit">Track</Button>
        </motion.form>

        {searched && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-brand-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-lg font-heading font-bold text-matte-black">Order #{orderId}</h2>
                  <p className="text-sm text-gray-400">12 May 2026 • 2 items</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-matte-black">{formatPrice(8490)}</p>
                  <span className="text-xs text-muted-gold-dark font-medium">COD — Pending</span>
                </div>
              </div>

              <div className="relative">
                {initialSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isLast = index === initialSteps.length - 1;
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                          step.completed
                            ? 'bg-emerald-100 text-emerald-600'
                            : step.current
                              ? 'bg-muted-gold/20 text-muted-gold-dark border-2 border-muted-gold'
                              : 'bg-gray-100 text-gray-300'
                        )}>
                          <StepIcon className="h-4 w-4" />
                        </div>
                        {!isLast && (
                          <div className={cn(
                            'w-0.5 h-12',
                            step.completed ? 'bg-emerald-200' : 'bg-gray-200'
                          )} />
                        )}
                      </div>
                      <div className={cn('pb-10', isLast && 'pb-0')}>
                        <p className={cn(
                          'text-sm font-medium',
                          step.current ? 'text-muted-gold-dark' : step.completed ? 'text-matte-black' : 'text-gray-300'
                        )}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400 italic mt-0.5">{step.urdu}</p>
                        <p className="text-xs text-gray-300 mt-1">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-soft-beige/60 rounded-2xl p-6 sm:p-8 text-center">
              <h3 className="text-lg font-heading font-bold text-matte-black mb-2">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4 italic">Koi masla ho toh humein batayein</p>
              <a
                href="https://wa.me/447444046103"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
                WhatsApp Support
              </a>
              <p className="text-xs text-gray-300 mt-3">
                Call/WhatsApp: <span className="font-medium">7440 046103</span>
              </p>
            </motion.div>
          </motion.div>
        )}

        {!searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm text-gray-400">Enter your Order ID above to track your parcel</p>
            <p className="text-xs text-gray-300 mt-2 italic">Order ID aap ki confirmation email aur SMS mein mil jaaye ga</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
