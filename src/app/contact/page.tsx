'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mb-2">Get in Touch</h1>
          <p className="text-gray-400 italic text-sm">Hum sunne ko taiyar hain</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            {[
              {
                icon: MessageCircle,
                label: 'WhatsApp',
                value: '7440 046103',
                href: 'https://wa.me/447444046103',
                note: 'Fastest response',
                bg: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Mail,
                label: 'Email',
                value: 'essenza0055@gmail.com',
                href: 'mailto:essenza0055@gmail.com',
                note: 'We reply within 24 hours',
                bg: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Phone,
                label: 'Phone',
                value: '+44 7440 046103',
                href: 'tel:+447444046103',
                note: '11 AM — 8 PM, Mon-Sat',
                bg: 'bg-amber-50 text-amber-600',
              },
              {
                icon: MapPin,
                label: 'Address',
                value: 'ESSANZA Lifestyle, Karachi, Pakistan',
                href: '#',
                note: 'Visit by appointment only',
                bg: 'bg-rose-50 text-rose-600',
              },
            ].map((item) => (
              <motion.a
                key={item.label}
                variants={itemVariants}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 bg-white rounded-xl border border-brand-100 p-4 hover:shadow-sm transition-shadow group"
              >
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', item.bg)}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-matte-black mt-0.5 group-hover:text-muted-gold-dark transition-colors">{item.value}</p>
                  <p className="text-[11px] text-gray-300 italic mt-0.5">{item.note}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-muted-gold-dark transition-colors mt-1" />
              </motion.a>
            ))}

            <motion.div variants={itemVariants} className="bg-soft-beige/50 rounded-xl p-4 text-center">
              <Clock className="h-4 w-4 text-muted-gold mx-auto mb-1" />
              <p className="text-xs text-gray-400">We typically respond within <span className="font-medium text-matte-black">1-2 hours</span> during business hours</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-brand-100 p-8 sm:p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-heading font-bold text-matte-black mb-2">Thank You!</h3>
                <p className="text-sm text-gray-400 italic">
                  Aap ka message hum tak pohanch gaya hai. Hum jald se jald aap se contact karein ge.{' '}
                  <span className="block mt-1">Jawaab ka intezaar karein — shukriya!</span>
                </p>
                <Button variant="outline" className="mt-6" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-100 p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-deep-charcoal">Full Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange}
                      placeholder="Aap ka naam" className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-deep-charcoal">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange}
                      placeholder="apka.email@example.com" className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-deep-charcoal">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="03XX-XXXXXXX" className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-deep-charcoal">Subject *</label>
                    <select name="subject" required value={formData.subject} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm appearance-none">
                      <option value="">Select a subject</option>
                      <option value="Order Inquiry">Order Inquiry</option>
                      <option value="Return/Exchange">Return / Exchange</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-deep-charcoal">Message *</label>
                  <textarea name="message" required rows={5} value={formData.message} onChange={handleChange}
                    placeholder="Apna yahan likhein..." className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm resize-none" />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400 mb-3">Frequently asked questions?</p>
          <Link href="/faq" className="inline-flex items-center gap-1 text-sm font-medium text-muted-gold-dark hover:text-muted-gold transition-colors">
            Visit our FAQ page <ChevronRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
