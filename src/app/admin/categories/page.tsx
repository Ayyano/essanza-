'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase/client';
import { cn, slugify } from '@/lib/utils';
import {
  ShoppingBag, Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Loader2, Save,
} from 'lucide-react';

type Subcategory = { name: string; slug: string };
type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  item_count: number;
  sort_order: number;
  subcategories: Subcategory[];
};

const emptyCategory = { name: '', slug: '', image: '', description: '', subcategories: [] as Subcategory[] };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [subInput, setSubInput] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await supabaseAdmin.from('categories').select('*').order('sort_order', { ascending: true });
      setCategories(data ?? []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      alert('Failed to load categories');
    }
    setLoading(false);
  };

  const openNew = () => {
    setForm(emptyCategory);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, image: cat.image, description: cat.description, subcategories: cat.subcategories ?? [] });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const addSubcategory = () => {
    if (!subInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: subInput.trim(), slug: slugify(subInput.trim()) }],
    }));
    setSubInput('');
  };

  const removeSubcategory = (index: number) => {
    setForm((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  const saveCategory = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug || slugify(form.name.trim()),
      image: form.image,
      description: form.description,
    };

    try {
      if (editingId) {
        await supabaseAdmin.from('categories').update(payload).eq('id', editingId);
      } else {
        const { data: max } = await supabaseAdmin.from('categories').select('sort_order').order('sort_order', { ascending: false }).limit(1);
        await supabaseAdmin.from('categories').insert({ ...payload, sort_order: (max?.[0]?.sort_order ?? 0) + 1 });
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category');
    }
    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    setDeletingId(id);
    try {
      await supabaseAdmin.from('categories').delete().eq('id', id);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category');
    }
    setDeletingId(null);
  };

  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const updated = [...categories];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((cat, i) => { cat.sort_order = i; });
    setCategories(updated);
    try {
      for (const cat of updated) {
        await supabaseAdmin.from('categories').update({ sort_order: cat.sort_order }).eq('id', cat.id);
      }
    } catch (err) {
      console.error('Error reordering categories:', err);
      alert('Failed to reorder categories');
      fetchCategories();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-matte-black">Categories</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-matte-black">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowForm(false)} className="text-matte-black/40 hover:text-matte-black"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Name</label>
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: editingId ? p.slug : slugify(e.target.value) }))}
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                />
              </div>
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Slug</label>
                <input
                  type="text" value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
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
                <label className="block text-sm text-matte-black/60 mb-1">Description</label>
                <textarea
                  rows={2} value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-matte-black/60 mb-1">Subcategories</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text" value={subInput}
                    onChange={(e) => setSubInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSubcategory()}
                    placeholder="Add subcategory..."
                    className="flex-1 px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                  />
                  <button onClick={addSubcategory} className="px-3 py-2 bg-soft-beige rounded-lg text-sm hover:bg-brand-200">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.subcategories.map((sub, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-soft-beige rounded text-xs">
                      {sub.name}
                      <button onClick={() => removeSubcategory(i)} className="text-matte-black/40 hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveCategory}
                  disabled={saving || !form.name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal disabled:opacity-50 transition-colors"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <Save size={16} />
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-brand-200 rounded-lg text-sm hover:bg-soft-beige">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-muted-gold" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-brand-200 flex flex-col items-center justify-center py-20 text-matte-black/50">
          <ShoppingBag size={48} className="mb-3 opacity-30" />
          <p>Koi category nahi hai</p>
          <p className="text-sm mt-1">Nayi category shamil karein</p>
          <button onClick={openNew} className="mt-4 flex items-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium">
            <Plus size={16} />
            Category Add Karein
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-soft-beige text-matte-black/60 text-left">
                  <th className="px-4 py-3 font-medium w-10"></th>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Subcategories</th>
                  <th className="px-4 py-3 font-medium w-28"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat.id} className="border-t border-brand-200 hover:bg-soft-beige/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveCategory(index, 'up')} disabled={index === 0} className="disabled:opacity-20 hover:text-muted-gold">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveCategory(index, 'down')} disabled={index === categories.length - 1} className="disabled:opacity-20 hover:text-muted-gold">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-soft-beige flex items-center justify-center">
                          <ShoppingBag size={16} className="text-matte-black/30" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-matte-black">{cat.name}</td>
                    <td className="px-4 py-3 text-matte-black/50 text-xs">{cat.slug}</td>
                    <td className="px-4 py-3">{cat.item_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(cat.subcategories ?? []).slice(0, 3).map((sub: Subcategory, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-soft-beige rounded text-xs text-matte-black/60">{sub.name}</span>
                        ))}
                        {(cat.subcategories ?? []).length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-matte-black/40">+{cat.subcategories.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded hover:bg-brand-200 text-matte-black/40 hover:text-muted-gold">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          disabled={deletingId === cat.id}
                          className="p-1.5 rounded hover:bg-brand-200 text-matte-black/40 hover:text-red-500 disabled:opacity-30"
                        >
                          {deletingId === cat.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
