'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  MessageCircle,
  CheckCircle,
  Package,
  Truck,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Building2,
  Edit3,
} from 'lucide-react';
import { CartProvider, useCart } from '@/lib/store';
import { formatPrice, cn, generateId } from '@/lib/utils';
import { supabaseAdmin } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Hyderabad', 'Peshawar', 'Quetta', 'Gujranwala',
  'Sialkot', 'Bahawalpur', 'Sargodha', 'Larkana', 'Sukkur',
  'Mardan', 'Rahim Yar Khan', 'Sahiwal', 'Okara', 'Mingora',
];

interface FormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  area: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
}

function generateOrderNumber(): string {
  const digits = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ESSANZA-${digits}`;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Apna naam zaroor likhein';
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'Naam kam se kam 3 characters ho';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number zaroori hai';
  } else {
    const cleaned = data.phone.replace(/[\s-]/g, '');
    const isValid = /^03\d{9}$/.test(cleaned);
    if (!isValid) {
      errors.phone = 'Sahi phone number likhein (03XX-XXXXXXX)';
    }
  }

  if (!data.city) {
    errors.city = 'City select karein';
  }

  if (!data.address.trim()) {
    errors.address = 'Address zaroori hai';
  } else if (data.address.trim().length < 10) {
    errors.address = 'Mukammal address likhein';
  }

  return errors;
}

function ConfirmationView({
  orderNumber,
  onBack,
}: {
  orderNumber: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center py-12 sm:py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-matte-black mb-2">
        Order Placed!
      </h2>
      <p className="text-gray-400 text-sm mb-8">
        Allah ka shukar hai, aapka order confirm ho gaya!
      </p>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-100/50 mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
          Order Number
        </p>
        <p className="text-xl font-bold text-matte-black font-mono tracking-wider">
          {orderNumber}
        </p>
      </div>

      <div className="bg-soft-beige/60 rounded-xl p-5 text-left space-y-3 mb-8">
        <p className="text-sm text-matte-black font-medium">
          Aage kya hoga?
        </p>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-muted-gold/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-muted-gold-dark">1</span>
          </div>
          <p className="text-sm text-gray-500">
            Hum aapko 24 ghanton mein confirm karein ge
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-muted-gold/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-muted-gold-dark">2</span>
          </div>
          <p className="text-sm text-gray-500">
            Order process hoke dispatch ho jaye ga
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-muted-gold/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-muted-gold-dark">3</span>
          </div>
          <p className="text-sm text-gray-500">
            3-7 working days mein delivery hogi
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/447444046103"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="gold" size="lg" className="w-full mb-3">
          <MessageCircle className="h-4 w-4" />
          WhatsApp Par Status Check Karein
        </Button>
      </a>

      <Link href="/">
        <Button variant="outline" size="md" className="w-full">
          Home Page
        </Button>
      </Link>
    </motion.div>
  );
}

function CheckoutContent() {
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [orderNumber, setOrderNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    area: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const deliveryFee = cartTotal >= 2000 ? 0 : 150;
  const total = cartTotal + deliveryFee;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateForm({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setTouched({ fullName: true, phone: true, city: true, address: true });

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const newOrderNumber = generateOrderNumber();

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: newOrderNumber,
          customer_name: formData.fullName.trim(),
          customer_phone: formData.phone.replace(/[\s-]/g, ''),
          shipping_city: formData.city,
          shipping_address: formData.address.trim() + (formData.area ? ` (${formData.area.trim()})` : ''),
          payment_method: 'COD',
          payment_status: 'pending',
          order_status: 'Pending',
          subtotal: cartTotal,
          delivery_fee: deliveryFee,
          discount: 0,
          total: cartTotal + deliveryFee,
          notes: '',
        })
        .select('id')
        .single();

      if (orderError || !order) {
        console.error('Order insert error:', orderError);
        throw new Error(orderError?.message || 'Failed to create order');
      }

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        size: item.size || null,
        color: item.color || null,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderNumber(newOrderNumber);
      clearCart();
      setStep('confirm');
    } catch (err) {
      console.error('Order submission failed:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Order submit nahi ho saka: ' + message + '. Dobara koshish karein ya WhatsApp karein.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'confirm') {
    return (
      <ConfirmationView
        orderNumber={orderNumber}
        onBack={() => setStep('form')}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <Package className="h-12 w-12 text-muted-gold mb-4" />
        <h2 className="text-xl font-heading font-semibold text-matte-black mb-2">
          Apki toli khali hai
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Checkout karne se pehle kuch add karein
        </p>
        <Link href="/">
          <Button variant="primary">Shopping Shuru Karein</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-matte-black">
            Checkout
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Apna address dein aur order confirm karein
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-brand-100/50">
                <h2 className="text-lg font-heading font-semibold text-matte-black mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-gold" />
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-matte-black mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                        placeholder="Apna poora naam likhein"
                        className={cn(
                          'w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-matte-black placeholder:text-gray-300',
                          'focus:outline-none focus:ring-2 focus:ring-muted-gold/30 focus:border-muted-gold',
                          'transition-all duration-200',
                          errors.fullName && touched.fullName
                            ? 'border-red-300 bg-red-50/30'
                            : 'border-gray-200 bg-white'
                        )}
                      />
                    </div>
                    {errors.fullName && touched.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-matte-black mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        placeholder="03XX-XXXXXXX"
                        className={cn(
                          'w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-matte-black placeholder:text-gray-300',
                          'focus:outline-none focus:ring-2 focus:ring-muted-gold/30 focus:border-muted-gold',
                          'transition-all duration-200',
                          errors.phone && touched.phone
                            ? 'border-red-300 bg-red-50/30'
                            : 'border-gray-200 bg-white'
                        )}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-300 mt-1">
                      Delivery confirm karne ke liye hum is number par contact karein ge
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-matte-black mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
                      <select
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        className={cn(
                          'w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-matte-black appearance-none bg-white',
                          'focus:outline-none focus:ring-2 focus:ring-muted-gold/30 focus:border-muted-gold',
                          'transition-all duration-200',
                          !formData.city && 'text-gray-300',
                          errors.city && touched.city
                            ? 'border-red-300 bg-red-50/30'
                            : 'border-gray-200'
                        )}
                      >
                        <option value="">Select your city</option>
                        {PAKISTAN_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="h-4 w-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.city && touched.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-matte-black mb-1.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      placeholder="Ghar ka poora address likhein — gali number, house number, sector, etc."
                      rows={3}
                      className={cn(
                        'w-full px-4 py-2.5 rounded-lg border text-sm text-matte-black placeholder:text-gray-300 resize-none',
                        'focus:outline-none focus:ring-2 focus:ring-muted-gold/30 focus:border-muted-gold',
                        'transition-all duration-200',
                        errors.address && touched.address
                          ? 'border-red-300 bg-red-50/30'
                          : 'border-gray-200 bg-white'
                      )}
                    />
                    {errors.address && touched.address && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-matte-black mb-1.5">
                      Area / Landmark
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => updateField('area', e.target.value)}
                      placeholder="Koi landmark ho to batayein (optional)"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-matte-black placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-gold/30 focus:border-muted-gold transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-soft-beige/60 rounded-xl p-4 sm:p-5">
                <p className="text-xs text-muted-gold-dark font-medium mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Payment
                </p>
                <p className="text-sm text-matte-black font-medium">
                  Cash on Delivery (COD)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Jab parcel aap ke ghar pahunche ga, tab payment karein. Koi extra charges nahi.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-brand-100/50 sticky top-24 space-y-5">
                <h2 className="text-lg font-heading font-semibold text-matte-black">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-soft-beige shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-matte-black leading-tight line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                          {item.size && ` | ${item.size}`}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-matte-black shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium text-matte-black">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery</span>
                    <span
                      className={cn(
                        'font-medium',
                        deliveryFee === 0 ? 'text-emerald-600' : 'text-matte-black'
                      )}
                    >
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t border-brand-100 pt-2.5">
                    <div className="flex justify-between">
                      <span className="font-semibold text-matte-black">
                        Total
                      </span>
                      <span className="font-bold text-matte-black text-lg">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={submitting}
                >
                  {submitting ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Place Order — {formatPrice(total)}
                    </>
                  )}
                </Button>

                <div className="text-center space-y-1.5">
                  <p className="text-[11px] text-gray-300 flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Safe & Secure • COD Available
                  </p>
                  <p className="text-[11px] text-gray-300">
                    Order confirm karne ke baad hum WhatsApp par details share karein ge
                  </p>
                  <p className="text-[10px] text-gray-200 italic">
                    Koi issue ho toh WhatsApp karein: 7440 046103
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}
