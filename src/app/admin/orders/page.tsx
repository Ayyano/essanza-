'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/client';
import { cn, formatPrice } from '@/lib/utils';
import {
  Package, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Calendar, ExternalLink, Loader2,
} from 'lucide-react';

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

const statuses = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as const;

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

const PAGE_SIZE = 15;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabaseAdmin.from('orders').select('*', { count: 'exact' });

      if (statusFilter !== 'All') {
        query = query.eq('order_status', statusFilter);
      }

      if (search) {
        query = query.or(`order_number.ilike.%${search}%,customer_phone.ilike.%${search}%`);
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, count } = await query;
      setOrders(data ?? []);
      setTotalCount(count ?? 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    async function fetchTodayCount() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      setTodayCount(count ?? 0);
    }
    fetchTodayCount();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    await supabaseAdmin.from('orders').update({ order_status: newStatus }).eq('id', id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, order_status: newStatus } : o)));
    setUpdatingId(null);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-matte-black">Orders</h1>
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg border border-brand-200">
          <Calendar size={16} className="text-muted-gold" />
          <span className="text-matte-black/70">Today:</span>
          <span className="font-bold text-matte-black">{todayCount}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-200 overflow-hidden">
        <div className="p-4 border-b border-brand-200 space-y-4">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  statusFilter === s
                    ? 'bg-matte-black text-warm-white'
                    : 'bg-soft-beige text-matte-black/70 hover:bg-brand-200',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/40" />
            <input
              type="text"
              placeholder="Search by order number or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-muted-gold bg-warm-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-muted-gold" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-matte-black/50">
            <Package size={48} className="mb-3 opacity-30" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-soft-beige text-matte-black/60 text-left">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-t border-brand-200 hover:bg-soft-beige/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3 font-medium text-matte-black">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-muted-gold flex items-center gap-1"
                        >
                          #{order.order_number}
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-matte-black">{order.customer_name}</td>
                      <td className="px-4 py-3 text-matte-black/70">{order.customer_phone}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', paymentColors[order.payment_status] || paymentColors.Pending)}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[order.order_status] || 'bg-gray-100 text-gray-800')}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-matte-black/50 text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-expanded`}>
                        <td colSpan={8} className="px-4 py-4 bg-soft-beige/50">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm text-matte-black/70">Quick status:</span>
                            {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                              <button
                                key={s}
                                disabled={updatingId === order.id}
                                onClick={() => updateStatus(order.id, s)}
                                className={cn(
                                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                                  order.order_status === s
                                    ? 'bg-matte-black text-warm-white'
                                    : 'bg-white border border-brand-200 text-matte-black/60 hover:border-muted-gold',
                                )}
                              >
                                {s}
                              </button>
                            ))}
                            {updatingId === order.id && <Loader2 size={14} className="animate-spin text-muted-gold" />}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand-200">
            <span className="text-sm text-matte-black/50">
              Page {page} of {totalPages} ({totalCount} orders)
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded hover:bg-soft-beige disabled:opacity-30 text-matte-black/60"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded hover:bg-soft-beige disabled:opacity-30 text-matte-black/60"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
