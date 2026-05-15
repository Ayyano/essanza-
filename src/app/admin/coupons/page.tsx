'use client';

import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Tag, Plus, Pencil, Trash2, X, Loader2, Save, RefreshCw,
} from 'lucide-react';

type Coupon = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  expires_at: string;
  is_active: boolean;
};

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const emptyCoupon: {
  code: string; discount_type: 'percentage' | 'fixed'; discount_value: number; min_order: number; max_uses: number; expires_at: string; is_active: boolean;
} = {
  code: '', discount_type: 'percentage', discount_value: 0, min_order: 0, max_uses: 0, expires_at: '', is_active: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await supabaseAdmin.from('coupons').select('*').order('created_at', { ascending: false });
      setCoupons((data ?? []).map((item: any) => ({
        id: item.id,
        code: item.code,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        min_order: item.min_order,
        max_uses: item.max_uses,
        used_count: item.used_count,
        expires_at: item.expires_at,
        is_active: item.is_active,
      })));
    } catch (err) {
      console.error('Error fetching coupons:', err);
      alert('Failed to load coupons');
    }
    setLoading(false);
  };

  const openNew = () => {
    setForm({ ...emptyCoupon, code: generateCode() });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order: coupon.min_order,
      max_uses: coupon.max_uses,
      expires_at: coupon.expires_at?.split('T')[0] ?? '',
      is_active: coupon.is_active,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const saveCoupon = async () => {
    if (!form.code.trim() || form.discount_value <= 0) return;
    setSaving(true);
    const payload = { ...form, code: form.code.toUpperCase().trim() };

    try {
      if (editingId) {
        await supabaseAdmin.from('coupons').update(payload).eq('id', editingId);
      } else {
        await supabaseAdmin.from('coupons').insert(payload);
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      console.error('Error saving coupon:', err);
      alert('Failed to save coupon');
    }
    setSaving(false);
  };

  const deleteCoupon = async (id: string) => {
    setDeletingId(id);
    try {
      await supabaseAdmin.from('coupons').delete().eq('id', id);
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert('Failed to delete coupon');
    }
    setDeletingId(null);
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await supabaseAdmin.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id);
      fetchCoupons();
    } catch (err) {
      console.error('Error toggling coupon:', err);
      alert('Failed to toggle coupon status');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-matte-black">Coupons</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors"
        >
          <Plus size={16} />
          Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-matte-black">{editingId ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setShowForm(false)} className="text-matte-black/40 hover:text-matte-black"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Code</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={form.code}
                    onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-brand-200 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                  />
                  <button
                    onClick={() => setForm((p) => ({ ...p, code: generateCode() }))}
                    className="px-3 py-2 border border-brand-200 rounded-lg text-matte-black/60 hover:bg-soft-beige"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-matte-black/60 mb-1">Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm((p) => ({ ...p, discount_type: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-matte-black/60 mb-1">Value</label>
                  <input
                    type="number" min={0} value={form.discount_value || ''}
                    onChange={(e) => setForm((p) => ({ ...p, discount_value: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-matte-black/60 mb-1">Min Order</label>
                  <input
                    type="number" min={0} value={form.min_order || ''}
                    onChange={(e) => setForm((p) => ({ ...p, min_order: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-matte-black/60 mb-1">Max Uses</label>
                  <input
                    type="number" min={0} value={form.max_uses || ''}
                    onChange={(e) => setForm((p) => ({ ...p, max_uses: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Expiry Date</label>
                  <input
                    type="date" value={form.expires_at}
                    onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))}
                    className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                  />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-brand-200 text-muted-gold focus:ring-muted-gold"
                />
                <span className="text-sm text-matte-black/70">Active</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveCoupon}
                  disabled={saving || !form.code.trim() || form.discount_value <= 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal disabled:opacity-50 transition-colors"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={16} />
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-brand-200 rounded-lg text-sm hover:bg-soft-beige">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-muted-gold" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-200 flex flex-col items-center justify-center py-20 text-matte-black/50">
          <Tag size={48} className="mb-3 opacity-30" />
          <p>No coupons yet</p>
          <button onClick={openNew} className="mt-4 flex items-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium">
            <Plus size={16} />
            Add Coupon
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-soft-beige text-matte-black/60 text-left">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Min Order</th>
                  <th className="px-4 py-3 font-medium">Uses</th>
                  <th className="px-4 py-3 font-medium">Expiry</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-brand-200 hover:bg-soft-beige/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-matte-black bg-soft-beige px-2 py-0.5 rounded">{coupon.code}</span>
                    </td>
                    <td className="px-4 py-3 text-matte-black/60 capitalize">{coupon.discount_type}</td>
                    <td className="px-4 py-3 font-medium">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `Rs. ${coupon.discount_value}`}
                    </td>
                    <td className="px-4 py-3 text-matte-black/60">Rs. {coupon.min_order}</td>
                    <td className="px-4 py-3">
                      <span className="text-matte-black">{coupon.used_count ?? 0}</span>
                      {coupon.max_uses > 0 && <span className="text-matte-black/40"> / {coupon.max_uses}</span>}
                    </td>
                    <td className="px-4 py-3 text-matte-black/50 text-xs">
                      {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('en-PK') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(coupon)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                          coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
                        )}
                      >
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(coupon)} className="p-1.5 rounded hover:bg-brand-200 text-matte-black/40 hover:text-muted-gold">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          disabled={deletingId === coupon.id}
                          className="p-1.5 rounded hover:bg-brand-200 text-matte-black/40 hover:text-red-500 disabled:opacity-30"
                        >
                          {deletingId === coupon.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
