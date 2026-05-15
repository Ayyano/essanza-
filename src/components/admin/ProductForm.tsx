'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { cn, slugify } from '@/lib/utils';
import { supabaseAdmin } from '@/lib/supabase/client';
import type { Product } from '@/types';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface ProductFormData {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  salePrice: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  tags: string;
  stockQuantity: string;
  inStock: boolean;
  isNew: boolean;
  isTrending: boolean;
  onSale: boolean;
}

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

function defaultFormData(initialData?: Product): ProductFormData {
  if (initialData) {
    return {
      name: initialData.name,
      slug: initialData.slug,
      category: initialData.category,
      description: initialData.description,
      price: String(initialData.price),
      salePrice: initialData.salePrice ? String(initialData.salePrice) : '',
      images: initialData.images.length > 0 ? initialData.images : [''],
      colors: initialData.colors ?? [],
      sizes: initialData.sizes ?? [],
      tags: initialData.tags.join(', '),
      stockQuantity: '0',
      inStock: initialData.inStock,
      isNew: initialData.isNew,
      isTrending: initialData.isTrending,
      onSale: initialData.onSale,
    };
  }
  return {
    name: '',
    slug: '',
    category: '',
    description: '',
    price: '',
    salePrice: '',
    images: [''],
    colors: [],
    sizes: [],
    tags: '',
    stockQuantity: '0',
    inStock: true,
    isNew: false,
    isTrending: false,
    onSale: false,
  };
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(() => defaultFormData(initialData));
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    supabaseAdmin.from('categories').select('name').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (!slugManuallyEdited && form.name) {
      setForm(prev => ({ ...prev, slug: slugify(form.name) }));
    }
  }, [form.name, slugManuallyEdited]);

  const update = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const addImage = () => {
    if (form.images.length < 5) {
      setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const setImage = (index: number, value: string) => {
    setForm(prev => ({ ...prev, images: prev.images.map((img, i) => (i === index ? value : img)) }));
  };

  const addColor = () => {
    setForm(prev => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#C4A97D' }] }));
  };

  const setColor = (index: number, field: 'name' | 'hex', value: string) => {
    setForm(prev => ({ ...prev, colors: prev.colors.map((c, i) => (i === index ? { ...c, [field]: value } : c)) }));
  };

  const removeColor = (index: number) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  const toggleSize = (size: string) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (form.salePrice && (isNaN(Number(form.salePrice)) || Number(form.salePrice) < 0)) errs.salePrice = 'Invalid sale price';
    if (form.images.filter(Boolean).length === 0) errs.images = 'At least one image URL is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      sale_price: form.salePrice ? Number(form.salePrice) : null,
      images: form.images.filter(Boolean),
      colors: form.colors.filter(c => c.name.trim()),
      sizes: form.sizes,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      stock_quantity: Number(form.stockQuantity) || 0,
      in_stock: form.inStock,
      is_new: form.isNew,
      is_trending: form.isTrending,
      on_sale: form.onSale,
      rating: initialData?.rating ?? 0,
      review_count: initialData?.reviewCount ?? 0,
    });
  };

  const inputClass = (field: string) => cn(
    'w-full px-4 py-3 rounded-lg border bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm',
    errors[field] ? 'border-red-400' : 'border-brand-200'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="bg-white rounded-xl border border-brand-100 p-6 space-y-5">
        <h3 className="text-lg font-heading font-semibold text-matte-black">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal">Product Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Embroidered Lawn Suit" className={inputClass('name')} />
            {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal">Slug</label>
            <input type="text" value={form.slug} onChange={e => { update('slug', e.target.value); setSlugManuallyEdited(true); }} placeholder="product-slug" className={cn(inputClass('slug'), 'font-mono')} />
            {errors.slug && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.slug}</p>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal">Category</label>
            <select value={form.category} onChange={e => update('category', e.target.value)} className={cn(inputClass('category'), 'appearance-none')}>
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.category}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-deep-charcoal">Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="Product description..." className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm resize-y" />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-brand-100 p-6 space-y-5">
        <h3 className="text-lg font-heading font-semibold text-matte-black">Pricing</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal">Price (Rs.)</label>
            <input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="e.g. 4990" min="0" className={inputClass('price')} />
            {errors.price && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.price}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal">Sale Price (optional)</label>
            <input type="number" value={form.salePrice} onChange={e => update('salePrice', e.target.value)} placeholder="e.g. 3990" min="0" className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-brand-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-matte-black">Images</h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => {
              const url = prompt('Enter image URL:');
              if (url) setForm(prev => ({ ...prev, images: [...prev.images, url] }));
            }} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-muted-gold-dark transition-colors font-medium">
              <LinkIcon className="h-3 w-3" /> Add URL
            </button>
          </div>
        </div>
        <ImageUpload
          images={form.images}
          onChange={(urls) => setForm(prev => ({ ...prev, images: urls }))}
          maxImages={5}
        />
        {errors.images && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.images}</p>}
      </section>

      <section className="bg-white rounded-xl border border-brand-100 p-6 space-y-5">
        <h3 className="text-lg font-heading font-semibold text-matte-black">Colors & Sizes</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-deep-charcoal">Colors</label>
            <button type="button" onClick={addColor} className="flex items-center gap-1.5 text-sm text-muted-gold-dark hover:text-muted-gold transition-colors font-medium">
              <Plus className="h-4 w-4" /> Add Color
            </button>
          </div>
          <div className="space-y-2">
            {form.colors.map((color, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="color" value={color.hex} onChange={e => setColor(i, 'hex', e.target.value)} className="h-10 w-10 rounded-lg border border-brand-200 cursor-pointer bg-transparent shrink-0" />
                <input type="text" value={color.name} onChange={e => setColor(i, 'name', e.target.value)} placeholder="Color name" className="flex-1 px-4 py-2.5 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm" />
                <button type="button" onClick={() => removeColor(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {form.colors.length === 0 && <p className="text-sm text-gray-400 italic">No colors added yet</p>}
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-deep-charcoal">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map(size => (
              <button key={size} type="button" onClick={() => toggleSize(size)} className={cn('px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200', form.sizes.includes(size) ? 'bg-matte-black text-warm-white border-matte-black' : 'bg-white text-gray-600 border-brand-200 hover:border-gray-400 hover:text-matte-black')}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-brand-100 p-6 space-y-5">
        <h3 className="text-lg font-heading font-semibold text-matte-black">Tags & Inventory</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="e.g. summer, lawn, embroidered" className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-deep-charcoal">Stock Quantity</label>
            <input type="number" value={form.stockQuantity} onChange={e => update('stockQuantity', e.target.value)} placeholder="0" min="0" className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-warm-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-brand-100 p-6 space-y-5">
        <h3 className="text-lg font-heading font-semibold text-matte-black">Product Status</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'inStock' as const, label: 'In Stock' },
            { key: 'isNew' as const, label: 'New Arrival' },
            { key: 'isTrending' as const, label: 'Trending' },
            { key: 'onSale' as const, label: 'On Sale' },
          ].map(t => (
            <label key={t.key} className="flex items-center justify-between p-3 rounded-lg border border-brand-100 bg-warm-white cursor-pointer hover:bg-soft-beige/50 transition-colors">
              <span className="text-sm font-medium text-deep-charcoal">{t.label}</span>
              <button type="button" role="switch" aria-checked={form[t.key]} onClick={() => update(t.key, !form[t.key])} className={cn('relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-muted-gold focus:ring-offset-2', form[t.key] ? 'bg-muted-gold' : 'bg-gray-200')}>
                <span className={cn('pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', form[t.key] ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </label>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end gap-4 pb-8">
        <button type="submit" disabled={isLoading} className={cn('px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-matte-black text-warm-white hover:bg-deep-charcoal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2')}>
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
