'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Gem, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const values = [
  { icon: Heart, title: 'Mohabbat se bana', desc: 'Har product mein mohabbat hai. Hum apne kaam se pyaar karte hain aur ye pyaar har stitch mein dikhta hai.' },
  { icon: Shield, title: 'Quality first', desc: 'Quality humari pehchan hai. Best fabric, best material, best finishing — kabhi compromise nahi.' },
  { icon: Sparkles, title: 'Style for everyone', desc: 'Har Pakistanio ke liye kuch na kuch. Women, Men, Kids — sab ke liye ESSANZA.' },
  { icon: Gem, title: 'Premium feel', desc: 'Luxury feels par affordable prices. ESSANZA ka matlab hai premium feel jo har koi afford kar sakay.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-soft-beige/40 to-warm-white pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-muted-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-muted-gold/5 rounded-full blur-3xl" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-3xl mx-auto text-center"
        >
          <motion.span variants={itemVariants} className="text-xs uppercase tracking-[0.3em] text-muted-gold-dark font-medium">
            ESSANZA — Premium Lifestyle
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-matte-black mt-6 leading-tight"
          >
            A Style That Speaks
            <span className="block text-muted-gold-dark">Without Saying a Word</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-400 italic text-sm sm:text-base mt-6 max-w-xl mx-auto leading-relaxed"
          >
            ESSANZA sirf ek brand nahi hai — ye ek jazba hai, ek ehsaas hai, aur ek pehchaan hai.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-brand-100"
          >
            <Quote className="h-8 w-8 text-muted-gold/30 mb-6" />
            <div className="space-y-6 max-w-3xl">
              <p className="text-lg sm:text-xl text-matte-black leading-relaxed font-light">
                ESSANZA ka safar ek simple se idea se shuru hua — <span className="font-medium">har Pakistani ko premium lifestyle products dena jo unki personality ko reflect karein.</span>
              </p>
              <p className="text-gray-500 leading-relaxed">
                Hum ne dekha ke Pakistan mein bohot saare brands hain, lekin koi nahi jo har cheez ek jagah de — <span className="text-matte-black font-medium">Women Unstitched se le kar Electronics tak, Cosmetics se Home Essentials tak.</span> ESSANZA ne ye gap fill kiya.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Aaj ESSANZA ek complete lifestyle brand hai. <span className="text-matte-black font-medium">Jab aap ESSANZA pehnte hain, toh aap sirf kapra nahi pehnte — aap ek statement dete hain.</span> Ke aap quality samajhte hain, style samajhte hain, aur apne aap ko value karte hain.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Har product jo ESSANZA ka ban-ta hai, <span className="text-matte-black font-medium">usmein quality check hota hai, fabric check hota hai, aur har stitch mein mohabbat hoti hai.</span> Kyonke hum jaante hain ke aap sirf ek product nahi kharid rahe — aap ek experience kharid rahe hain.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-brand-100">
              <p className="text-sm font-heading font-bold text-matte-black">— Team ESSANZA</p>
              <p className="text-xs text-gray-400 italic">Karachi, Pakistan</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-20 bg-soft-beige/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-muted-gold-dark font-medium">Hum Kya Maante Hain</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mt-3">Our Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-brand-100 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-muted-gold/10 flex items-center justify-center mb-4">
                  <value.icon className="h-5 w-5 text-muted-gold-dark" />
                </div>
                <h3 className="text-lg font-heading font-bold text-matte-black mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-muted-gold-dark font-medium">Kyunke Quality Matters</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mt-3">Our Commitment</h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { stat: '100%', label: 'Authentic Products', desc: 'Koi duplicate nahi, sirf asli maal' },
              { stat: '7 Days', label: 'Return Policy', desc: 'Koi issue ho toh wapas karein' },
              { stat: '24/7', label: 'Customer Support', desc: 'Hum hain aap ke liye har waqt' },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center p-6"
              >
                <p className="text-4xl font-heading font-bold text-muted-gold-dark mb-2">{item.stat}</p>
                <p className="text-sm font-semibold text-matte-black mb-1">{item.label}</p>
                <p className="text-xs text-gray-400 italic">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
