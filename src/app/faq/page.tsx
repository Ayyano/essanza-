'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Package, Truck, RotateCcw, HelpCircle, CreditCard, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FAQ_DATA, SITE_INFO } from '@/lib/constants';
import { Button } from '@/components/ui';

const categoryIcons: Record<string, typeof Truck> = {
  'Shipping': Truck,
  'Returns': RotateCcw,
  'Orders': Package,
  'Products': HelpCircle,
  'Payment': CreditCard,
};

const categorizedFAQs = (() => {
  const cats: Record<string, typeof FAQ_DATA> = {
    'Shipping': [],
    'Returns': [],
    'Orders': [],
    'Products': [],
    'Payment': [],
    'General': [],
  };
  FAQ_DATA.forEach((faq) => {
    const q = faq.question.toLowerCase();
    if (q.includes('shipping') || q.includes('delivery')) cats['Shipping'].push(faq);
    else if (q.includes('return') || q.includes('exchange') || q.includes('wapas')) cats['Returns'].push(faq);
    else if (q.includes('order') || q.includes('kaise kar') || q.includes('confirm')) cats['Orders'].push(faq);
    else if (q.includes('size') || q.includes('authentic') || q.includes('product') || q.includes('out of stock') || q.includes('measurement')) cats['Products'].push(faq);
    else if (q.includes('payment') || q.includes('cod') || q.includes('cash') || q.includes('online') || q.includes('discount') || q.includes('sale')) cats['Payment'].push(faq);
    else cats['General'].push(faq);
  });
  return Object.entries(cats).filter(([, v]) => v.length > 0);
})();

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = useMemo(() => {
    let faqs = FAQ_DATA;
    if (activeCategory !== 'All') {
      const found = categorizedFAQs.find(([name]) => name === activeCategory);
      faqs = found ? found[1] : [];
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      faqs = faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }
    return faqs;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-400 italic text-sm">Aap ke sawaal, humare jawaab</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-brand-200 bg-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8"
        >
          {[{ icon: HelpCircle, name: 'All' }, ...categorizedFAQs.map(([name]) => ({ icon: categoryIcons[name] || HelpCircle, name }))].map((cat) => (
            <button
              key={cat.name}
              onClick={() => { setActiveCategory(cat.name); setOpenIndex(null); }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border',
                activeCategory === cat.name
                  ? 'bg-matte-black text-warm-white border-matte-black'
                  : 'bg-white text-gray-500 border-brand-200 hover:text-matte-black hover:border-matte-black'
              )}
            >
              <cat.icon className="h-3 w-3" />
              {cat.name}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Koi sawaal nahi mila</p>
              <p className="text-xs text-gray-300 italic mt-1">Kuch aur search karein ya humein directly poochiye</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-xl border border-brand-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-soft-beige/30 transition-colors"
                >
                  <span className="text-sm font-medium text-matte-black flex-1">{faq.question}</span>
                  <ChevronDown className={cn(
                    'h-4 w-4 text-gray-300 shrink-0 transition-transform duration-200',
                    openIndex === index && 'rotate-180'
                  )} />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-soft-beige/50 rounded-2xl p-6 sm:p-8 text-center"
        >
          <h3 className="text-lg font-heading font-bold text-matte-black mb-2">Still have questions?</h3>
          <p className="text-sm text-gray-400 mb-4 italic">Hum aap ki madad ke liye yahan hain</p>
          <a
            href={`https://wa.me/${SITE_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Par Poochiye
          </a>
        </motion.div>
      </div>
    </div>
  );
}
