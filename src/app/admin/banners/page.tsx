'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Image as ImageIcon, Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Loader2, Save,
} from 'lucide-react';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  link: string;
  is_active: boolean;
  sort_order: number;
};

const emptyBanner = { title: '', subtitle: '', cta: '', image: '', link: '', is_active: true };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyBanner);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await supabaseAdmin.from('banners').select('*').order('sort_order', { ascending: true });
      setBanners(data ?? []);
    } catch (err) {
      console.error('Error fetching banners:', err);
      alert('Failed to load banners');
    }
    setLoading(false);
  };

  const openNew = () => {
    setForm(emptyBanner);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (banner: Banner) => {
    setForm({ title: banner.title, subtitle: banner.subtitle, cta: banner.cta, image: banner.image, link: banner.link, is_active: banner.is_active });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const saveBanner = async () => {
    if (!form.title.trim() || !form.image.trim()) return;
    setSaving(true);
    const { cta, ...payload } = form;
    try {
      if (editingId) {
        await supabaseAdmin.from('banners').update(payload).eq('id', editingId);
      } else {
        const { data: max } = await supabaseAdmin.from('banners').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        await supabaseAdmin.from('banners').insert({ ...payload, sort_order: (max?.[0]?.sort_order ?? 0) + 1 });
      }
      setShowForm(false);
      fetchBanners();
    } catch (err) {
      console.error('Error saving banner:', err);
      alert('Failed to save banner');
    }
    setSaving(false);
  };

  const deleteBanner = async (id: string) => {
    setDeletingId(id);
    try {
      await supabaseAdmin.from('banners').delete().eq('id', id);
      fetchBanners();
    } catch (err) {
      console.error('Error deleting banner:', err);
      alert('Failed to delete banner');
    }
    setDeletingId(null);
  };

  const moveBanner = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;
    const updated = [...banners];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((b, i) => { b.sort_order = i; });
    setBanners(updated);
    try {
      for (const b of updated) {
        await supabaseAdmin.from('banners').update({ sort_order: b.sort_order }).eq('id', b.id);
      }
    } catch (err) {
      console.error('Error reordering banners:', err);
      alert('Failed to reorder banners');
      fetchBanners();
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await supabaseAdmin.from('banners').update({ is_active: !banner.is_active }).eq('id', banner.id);
      fetchBanners();
    } catch (err) {
      console.error('Error toggling banner:', err);
      alert('Failed to toggle banner status');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-matte-black">Banners</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors"
        >
          <Plus size={16} />
          Add Banner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-matte-black">{editingId ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={() => setShowForm(false)} className="text-matte-black/40 hover:text-matte-black"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Title</label>
                <input
                  type="text" value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                />
              </div>
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Subtitle</label>
                <input
                  type="text" value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                />
              </div>
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">CTA Text</label>
                <input
                  type="text" value={form.cta}
                  onChange={(e) => setForm((p) => ({ ...p, cta: e.target.value }))}
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                />
              </div>
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Image URL</label>
                <input
                  type="text" value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                />
              </div>
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Link URL</label>
                <input
                  type="text" value={form.link}
                  onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
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

              {form.image && (
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-soft-beige">
                  <Image src={form.image} alt="Preview" fill className="object-cover" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveBanner}
                  disabled={saving || !form.title.trim() || !form.image.trim()}
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
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-200 flex flex-col items-center justify-center py-20 text-matte-black/50">
          <ImageIcon size={48} className="mb-3 opacity-30" />
          <p>No banners yet</p>
          <button onClick={openNew} className="mt-4 flex items-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium">
            <Plus size={16} />
            Add Banner
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-soft-beige text-matte-black/60 text-left">
                  <th className="px-4 py-3 font-medium w-10"></th>
                  <th className="px-4 py-3 font-medium">Preview</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">CTA</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-28"></th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner, index) => (
                  <tr key={banner.id} className="border-t border-brand-200 hover:bg-soft-beige/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveBanner(index, 'up')} disabled={index === 0} className="disabled:opacity-20 hover:text-muted-gold">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveBanner(index, 'down')} disabled={index === banners.length - 1} className="disabled:opacity-20 hover:text-muted-gold">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {banner.image ? (
                        <Image src={banner.image} alt={banner.title} width={64} height={36} className="w-16 h-9 rounded object-cover" />
                      ) : (
                        <div className="w-16 h-9 rounded bg-soft-beige flex items-center justify-center">
                          <ImageIcon size={14} className="text-matte-black/30" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-matte-black">{banner.title}</p>
                      {banner.subtitle && <p className="text-xs text-matte-black/50">{banner.subtitle}</p>}
                    </td>
                    <td className="px-4 py-3 text-matte-black/60">{banner.cta || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(banner)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                          banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
                        )}
                      >
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(banner)} className="p-1.5 rounded hover:bg-brand-200 text-matte-black/40 hover:text-muted-gold">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          disabled={deletingId === banner.id}
                          className="p-1.5 rounded hover:bg-brand-200 text-matte-black/40 hover:text-red-500 disabled:opacity-30"
                        >
                          {deletingId === banner.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
