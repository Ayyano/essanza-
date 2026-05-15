'use client';

import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Users, Search, X, Loader2, Package, Eye } from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  created_at: string;
};

type CustomerOrder = {
  id: string;
  order_number: string;
  total: number;
  order_status: string;
  created_at: string;
};

const PAGE_SIZE = 20;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [search, page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      let query = supabaseAdmin.from('customers').select('*', { count: 'exact' });

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const from = (page - 1) * PAGE_SIZE;
      query = query.order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1);

      const { data, count } = await query;
      setCustomers(data ?? []);
      setTotalCount(count ?? 0);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const viewCustomerOrders = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setOrdersLoading(true);
    const { data } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, total, order_status, created_at')
      .eq('customer_phone', customer.phone)
      .order('created_at', { ascending: false });
    setCustomerOrders(data ?? []);
    setOrdersLoading(false);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-matte-black">Customers</h1>
        <span className="text-sm text-matte-black/50">{totalCount} total</span>
      </div>

      <div className="bg-white rounded-xl border border-brand-200 overflow-hidden">
        <div className="p-4 border-b border-brand-200">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/40" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
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
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-matte-black/50">
            <Users size={48} className="mb-3 opacity-30" />
            <p>No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-soft-beige text-matte-black/60 text-left">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Orders</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-brand-200 hover:bg-soft-beige/50 transition-colors cursor-pointer"
                    onClick={() => viewCustomerOrders(customer)}
                  >
                    <td className="px-4 py-3 font-medium text-matte-black">{customer.name}</td>
                    <td className="px-4 py-3 text-matte-black/60">{customer.email || '—'}</td>
                    <td className="px-4 py-3 text-matte-black/70">{customer.phone || '—'}</td>
                    <td className="px-4 py-3">{customer.total_orders ?? 0}</td>
                    <td className="px-4 py-3 text-matte-black/50 text-xs">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); viewCustomerOrders(customer); }}
                        className="p-1.5 rounded hover:bg-brand-200 text-matte-black/40 hover:text-muted-gold"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand-200">
            <span className="text-sm text-matte-black/50">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded hover:bg-soft-beige disabled:opacity-30 text-matte-black/60"
              >
                ←
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded hover:bg-soft-beige disabled:opacity-30 text-matte-black/60"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-brand-200">
              <div>
                <h2 className="text-lg font-semibold text-matte-black">{selectedCustomer.name}</h2>
                <p className="text-sm text-matte-black/50">{selectedCustomer.email} • {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-matte-black/40 hover:text-matte-black">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-matte-black mb-3">Orders ({customerOrders.length})</h3>
              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={20} className="animate-spin text-muted-gold" />
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-matte-black/50">
                  <Package size={32} className="mb-2 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-soft-beige rounded-lg">
                      <div>
                        <span className="font-medium text-sm text-matte-black">#{order.order_number}</span>
                        <span className="text-xs text-matte-black/50 ml-2">
                          {new Date(order.created_at).toLocaleDateString('en-PK')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Rs. {order.total}</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700',
                        )}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
