'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X, AlertTriangle, Package, Eye, EyeOff } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { supabaseAdmin } from '@/lib/supabase/client';
import type { Product } from '@/types';

const ITEMS_PER_PAGE = 12;



export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [catIdToName, setCatIdToName] = useState<Record<string, string>>({});
  const [catNameToId, setCatNameToId] = useState<Record<string, string>>({});

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    supabaseAdmin.from('categories').select('id, name').then(({ data }) => {
      if (data) {
        setCategories(data);
        const idToName: Record<string, string> = {};
        const nameToId: Record<string, string> = {};
        data.forEach((c: { id: string; name: string }) => {
          idToName[c.id] = c.name;
          nameToId[c.name] = c.id;
        });
        setCatIdToName(idToName);
        setCatNameToId(nameToId);
      }
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabaseAdmin.from('products').select('*', { count: 'exact' });

      if (search) query = query.ilike('name', `%${search}%`);
      if (categoryFilter) query = query.eq('category_id', catNameToId[categoryFilter]);
      if (statusFilter !== 'all') query = query.eq('in_stock', statusFilter === 'active');

      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, count, error } = await query;
      if (error) throw error;

      const mapped = (data || []).map((row: Record<string, unknown>) => {
        const catId = (row.category_id as string) || '';
        return {
          id: row.id as string,
          name: row.name as string,
          slug: row.slug as string,
          category_id: catId,
          category: catIdToName[catId] || '',
          subcategory: row.subcategory as string || '',
          description: row.description as string || '',
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
        } as Product;
      });

      setProducts(mapped);
      setTotal(count ?? 0);
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, page, showToast, catIdToName, catNameToId]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleToggleStatus = async (product: Product) => {
    const newStatus = !product.inStock;
    const { error } = await supabaseAdmin.from('products').update({ in_stock: newStatus }).eq('id', product.id);
    if (error) {
      showToast('error', 'Failed to update status');
      return;
    }
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newStatus } : p));
    showToast('success', `Product ${newStatus ? 'activated' : 'deactivated'}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await supabaseAdmin.from('products').delete().eq('id', deleteId);
    setDeleting(false);
    if (error) {
      showToast('error', 'Failed to delete product');
      setDeleteId(null);
      return;
    }
    showToast('success', 'Product deleted successfully');
    setDeleteId(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-matte-black">Products</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your product inventory</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-brand-100 overflow-hidden">
          <div className="p-5 border-b border-brand-100 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-200 bg-warm-white text-sm text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-matte-black transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-brand-200 bg-warm-white text-sm text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all appearance-none min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2.5 rounded-lg border border-brand-200 bg-warm-white text-sm text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all appearance-none min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-soft-beige rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 text-center">
              <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-heading font-semibold text-gray-400">Abhi tak koi product nahi hai</p>
              <p className="text-sm text-gray-300 mt-1">Pehla product add karein</p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-100">
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-4">Image</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-4">Name</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-4">Category</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-4">Price</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-4">Stock</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-4">Status</th>
                      <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {products.map((product, i) => (
                        <motion.tr
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.03, duration: 0.25 }}
                          className="border-b border-brand-50 hover:bg-soft-beige/30 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-soft-beige border border-brand-100">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-matte-black truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{product.slug}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-brand-100 text-brand-700">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-matte-black">{formatPrice(product.price)}</p>
                            {product.salePrice && (
                              <p className="text-xs text-red-500 line-through">{formatPrice(product.salePrice)}</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full', product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => handleToggleStatus(product)}
                              className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', product.inStock ? 'bg-muted-gold/10 text-muted-gold-dark hover:bg-muted-gold/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200')}
                            >
                              {product.inStock ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                              {product.inStock ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/products/${product.id}`}
                                className="p-2 text-gray-400 hover:text-muted-gold-dark hover:bg-soft-beige rounded-lg transition-all"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => setDeleteId(product.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-brand-100">
                  <p className="text-sm text-gray-400">
                    Page {page} of {totalPages} ({total} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-2 rounded-lg border border-brand-200 text-gray-400 hover:text-matte-black hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-all', p === page ? 'bg-matte-black text-warm-white' : 'text-gray-500 hover:bg-soft-beige')}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="p-2 rounded-lg border border-brand-200 text-gray-400 hover:text-matte-black hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl pointer-events-auto">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-center text-matte-black mb-2">Delete Product?</h3>
                <p className="text-sm text-gray-400 text-center mb-6">Yeh product permanently delete ho jaye ga. Kya aap sure hain?</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg border border-brand-200 text-sm font-medium text-gray-600 hover:bg-soft-beige transition-colors">
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
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}
