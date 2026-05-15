'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase/client';
import { cn, formatPrice } from '@/lib/utils';
import {
  Package, ArrowLeft, Printer, Phone, CheckCircle, Clock, Truck, XCircle, Loader2,
} from 'lucide-react';

type OrderItem = {
  id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string;
  color?: string;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address?: string;
  shipping_city?: string;
  total: number;
  subtotal?: number;
  delivery_fee?: number;
  discount?: number;
  payment_status: string;
  order_status: string;
  notes?: string;
  created_at: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
};

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const paymentColors: Record<string, string> = {
  Paid: 'bg-green-100 text-green-800',
  Unpaid: 'bg-red-100 text-red-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<string, typeof CheckCircle> = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
};

const timelineSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      const { data } = await supabaseAdmin.from('orders').select('*').eq('id', params.id).single();
      if (data) {
        setOrder(data);
        setSelectedStatus(data.order_status);
      }
      const { data: orderItems } = await supabaseAdmin.from('order_items').select('*').eq('order_id', params.id);
      setItems(orderItems ?? []);
      setLoading(false);
    }
    fetchOrder();
  }, [params.id]);

  const updateStatus = async () => {
    if (!order || selectedStatus === order.order_status) return;
    setUpdating(true);
    const updateData: Record<string, string> = { order_status: selectedStatus };
    if (selectedStatus === 'Confirmed') updateData.confirmed_at = new Date().toISOString();
    if (selectedStatus === 'Shipped') updateData.shipped_at = new Date().toISOString();
    if (selectedStatus === 'Delivered') updateData.delivered_at = new Date().toISOString();
    await supabaseAdmin.from('orders').update(updateData).eq('id', order.id);
    setOrder((prev) => prev ? { ...prev, ...updateData } : null);
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-muted-gold" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-matte-black/50">
        <Package size={48} className="mb-3 opacity-30" />
        <p>Order not found</p>
        <Link href="/admin/orders" className="mt-4 text-sm text-muted-gold hover:underline">Back to orders</Link>
      </div>
    );
  }

  const currentStepIndex = timelineSteps.indexOf(order.order_status);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-lg hover:bg-brand-200 text-matte-black/60">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-heading font-bold text-matte-black">Order #{order.order_number}</h1>
          <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusColors[order.order_status])}>
            {order.order_status}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-brand-200 rounded-lg text-sm text-matte-black/70 hover:bg-soft-beige transition-colors"
          >
            <Printer size={16} />
            Print
          </button>
          <a
            href={`https://wa.me/${order.customer_phone.replace(/^0/, '92')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
          >
            <Phone size={16} />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-brand-200 p-6">
            <h2 className="text-lg font-semibold text-matte-black mb-4">Order Items</h2>
            {items.length === 0 ? (
              <p className="text-matte-black/50 text-sm py-4">No items found</p>
            ) : (
              <div className="divide-y divide-brand-200">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3">
                    <div className="w-16 h-16 rounded-lg bg-soft-beige overflow-hidden flex-shrink-0">
                      {item.product_image && (
                        <Image src={item.product_image} alt={item.product_name} width={64} height={64} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-matte-black text-sm">{item.product_name}</p>
                      <p className="text-xs text-matte-black/50">
                        {item.size && `Size: ${item.size}`}{item.size && item.color && ' | '}{item.color && `Color: ${item.color}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-matte-black">{formatPrice(item.unit_price)} × {item.quantity}</p>
                      <p className="text-sm font-semibold text-matte-black">{formatPrice(item.total_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-brand-200 pt-4 mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-matte-black/60">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal ?? order.total)}</span>
              </div>
              {order.delivery_fee ? (
                <div className="flex justify-between text-matte-black/60">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(order.delivery_fee)}</span>
                </div>
              ) : null}
              {order.discount ? (
                <div className="flex justify-between text-matte-black/60">
                  <span>Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between font-bold text-matte-black pt-2 border-t border-brand-200">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-brand-200 p-6">
            <h2 className="text-lg font-semibold text-matte-black mb-4">Order Timeline</h2>
            <div className="relative">
              {timelineSteps.map((step, index) => {
                const Icon = statusIcons[step];
                const isActive = currentStepIndex >= index;
                const isCancelled = order.order_status === 'Cancelled';
                const dateKey = step === 'Pending' ? 'created_at' : `${step.toLowerCase()}_at` as keyof Order;
                const date = order[dateKey] as string | undefined;

                return (
                  <div key={step} className={cn('flex items-start gap-3 pb-6 last:pb-0', isCancelled && index > 0 && 'opacity-30')}>
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        isCancelled && step === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        isActive ? 'bg-green-100 text-green-600' : 'bg-brand-200 text-matte-black/30',
                      )}>
                        <Icon size={16} />
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div className={cn('w-0.5 h-6', isActive ? 'bg-green-200' : 'bg-brand-200')} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={cn('text-sm font-medium', isActive ? 'text-matte-black' : 'text-matte-black/40')}>{step}</p>
                      {date && <p className="text-xs text-matte-black/50 mt-0.5">{new Date(date).toLocaleString('en-PK')}</p>}
                    </div>
                  </div>
                );
              })}
              {order.order_status === 'Cancelled' && (
                <div className="flex items-start gap-3 pt-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                    <XCircle size={16} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium text-red-600">Cancelled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-brand-200 p-6">
            <h2 className="text-lg font-semibold text-matte-black mb-4">Order Info</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-matte-black/50">Order #</dt>
                <dd className="font-medium">{order.order_number}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-matte-black/50">Date</dt>
                <dd>{new Date(order.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-matte-black/50">Payment</dt>
                <dd>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', paymentColors[order.payment_status])}>
                    {order.payment_status}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-matte-black/50">Status</dt>
                <dd>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[order.order_status])}>
                    {order.order_status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-brand-200 p-6">
            <h2 className="text-lg font-semibold text-matte-black mb-4">Customer</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-matte-black/50">Name</dt>
                <dd className="font-medium">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-matte-black/50">Phone</dt>
                <dd className="font-medium">
                  <a href={`tel:${order.customer_phone}`} className="hover:text-muted-gold">{order.customer_phone}</a>
                </dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-matte-black/50">Email</dt>
                  <dd>{order.customer_email}</dd>
                </div>
              )}
              {order.shipping_address && (
                <div>
                  <dt className="text-matte-black/50">Shipping Address</dt>
                  <dd className="text-matte-black/70">{order.shipping_address}{order.shipping_city ? `, ${order.shipping_city}` : ''}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-brand-200 p-6">
            <h2 className="text-lg font-semibold text-matte-black mb-4">Update Status</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white mb-3"
            >
              {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={updateStatus}
              disabled={updating || selectedStatus === order.order_status}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-matte-black text-warm-white rounded-lg text-sm font-medium hover:bg-deep-charcoal disabled:opacity-50 transition-colors"
            >
              {updating && <Loader2 size={14} className="animate-spin" />}
              Update Status
            </button>
          </div>

          {order.notes && (
            <div className="bg-white rounded-xl border border-brand-200 p-6">
              <h2 className="text-lg font-semibold text-matte-black mb-2">Notes</h2>
              <p className="text-sm text-matte-black/70">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
