'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { supabaseAdmin } from '@/lib/supabase/client';
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);
    const { error } = await supabaseAdmin.from('products').insert([data]);
    setIsLoading(false);
    if (error) {
      setToast({ type: 'error', message: error.message });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast({ type: 'success', message: 'Product created successfully!' });
    setTimeout(() => router.push('/admin/products'), 1000);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-soft-beige text-gray-400 hover:text-matte-black transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-matte-black">New Product</h1>
            <p className="text-sm text-gray-400 mt-1">Add a new product to your inventory</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50', toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white')}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}
