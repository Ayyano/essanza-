'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, AlertTriangle, Package } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { supabaseAdmin } from '@/lib/supabase/client';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product } from '@/types';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    supabaseAdmin.from('products').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error || !data) {
        setProduct(null);
      } else {
        const row = data as Record<string, unknown>;
        setProduct({
          id: row.id as string,
          name: row.name as string,
          slug: row.slug as string,
          category: (row.category as string) || '',
          description: (row.description as string) || '',
          price: Number(row.price),
          salePrice: row.sale_price ? Number(row.sale_price) : undefined,
          images: (row.images as string[]) || [],
          colors: row.colors ? (row.colors as { name: string; hex: string }[]) : undefined,
          sizes: (row.sizes as string[]) || undefined,
          tags: (row.tags as string[]) || [],
          rating: Number(row.rating) || 0,
          reviewCount: Number(row.review_count) || 0,
          inStock: row.in_stock as boolean ?? true,
          isNew: row.is_new as boolean ?? false,
          isTrending: row.is_trending as boolean ?? false,
          onSale: row.on_sale as boolean ?? false,
          createdAt: row.created_at as string || '',
        } as Product);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    const { error } = await supabaseAdmin.from('products').update(data).eq('id', id);
    setSaving(false);
    if (error) {
      setToast({ type: 'error', message: error.message });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast({ type: 'success', message: 'Product updated successfully!' });
    setTimeout(() => router.push('/admin/products'), 1000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    setDeleting(false);
    if (error) {
      setToast({ type: 'error', message: error.message });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-lg bg-soft-beige animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-soft-beige rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-soft-beige rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-soft-beige rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Package className="h-20 w-20 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-gray-400 mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-300 mb-6">Yeh product exist nahi karta ya delete ho chuka hai</p>
          <Link href="/admin/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 rounded-lg hover:bg-soft-beige text-gray-400 hover:text-matte-black transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-heading font-bold text-matte-black">Edit Product</h1>
              <p className="text-sm text-gray-400 mt-1">{product.name}</p>
            </div>
          </div>
          <button
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ProductForm initialData={product} onSubmit={handleSubmit} isLoading={saving} />
        </motion.div>
      </div>

      {showDelete && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowDelete(false)} className="fixed inset-0 bg-black/40 z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl pointer-events-auto">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-center text-matte-black mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-400 text-center mb-6">Yeh product permanently delete ho jaye ga. Kya aap sure hain?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 rounded-lg border border-brand-200 text-sm font-medium text-gray-600 hover:bg-soft-beige transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn('fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50', toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white')}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}
