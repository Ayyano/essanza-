'use client';

import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase/client';
import { Settings, Loader2, Save, CheckCircle2 } from 'lucide-react';

type SiteSettings = {
  site_name: string;
  whatsapp_number: string;
  contact_email: string;
  free_shipping_threshold: number;
  delivery_fee: number;
};

const defaults: SiteSettings = {
  site_name: 'ESSANZA',
  whatsapp_number: '',
  contact_email: '',
  free_shipping_threshold: 0,
  delivery_fee: 0,
};

export default function SettingsPage() {
  const [form, setForm] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabaseAdmin.from('site_settings').select('*').maybeSingle();
    if (data) {
      setForm({
        site_name: data.site_name ?? defaults.site_name,
        whatsapp_number: data.whatsapp_number ?? defaults.whatsapp_number,
        contact_email: data.contact_email ?? defaults.contact_email,
        free_shipping_threshold: data.free_shipping_threshold ?? defaults.free_shipping_threshold,
        delivery_fee: data.delivery_fee ?? defaults.delivery_fee,
      });
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    const { data: existing } = await supabaseAdmin.from('site_settings').select('id').maybeSingle();
    if (existing) {
      await supabaseAdmin.from('site_settings').update(form).eq('id', existing.id);
    } else {
      await supabaseAdmin.from('site_settings').insert(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-muted-gold" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-matte-black">Settings</h1>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-brand-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted-gold/20 flex items-center justify-center">
              <Settings size={20} className="text-muted-gold" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-matte-black">Site Settings</h2>
              <p className="text-sm text-matte-black/50">Manage your store configuration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-matte-black/70 mb-1">Site Name</label>
              <input
                type="text" value={form.site_name}
                onChange={(e) => setForm((p) => ({ ...p, site_name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-matte-black/70 mb-1">WhatsApp Number</label>
              <input
                type="text" value={form.whatsapp_number}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp_number: e.target.value }))}
                placeholder="e.g. 923001234567"
                className="w-full px-3 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
              />
              <p className="text-xs text-matte-black/40 mt-1">Without + sign, include country code</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-matte-black/70 mb-1">Contact Email</label>
              <input
                type="email" value={form.contact_email}
                onChange={(e) => setForm((p) => ({ ...p, contact_email: e.target.value }))}
                className="w-full px-3 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-matte-black/70 mb-1">
                  Free Shipping Threshold <span className="text-xs text-matte-black/40">(Rs.)</span>
                </label>
                <input
                  type="number" min={0} value={form.free_shipping_threshold || ''}
                  onChange={(e) => setForm((p) => ({ ...p, free_shipping_threshold: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-matte-black/70 mb-1">
                  Delivery Fee <span className="text-xs text-matte-black/40">(Rs.)</span>
                </label>
                <input
                  type="number" min={0} value={form.delivery_fee || ''}
                  onChange={(e) => setForm((p) => ({ ...p, delivery_fee: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : saved ? (
                  <CheckCircle2 size={16} className="text-green-400" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
