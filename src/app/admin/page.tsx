import { supabaseAdmin } from '@/lib/supabase/client'
import { cn, formatPrice } from '@/lib/utils'
import {
  Package, ShoppingCart, Users, TrendingUp,
  AlertTriangle, PlusCircle, List, Settings,
} from 'lucide-react'
import Link from 'next/link'

interface RecentOrder {
  id: string
  customer_name?: string
  total?: number
  order_status?: string
  created_at?: string
}

interface LowStockProduct {
  id: string
  name?: string
  stock_quantity?: number
}

interface DashboardStat {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
  recentOrders: RecentOrder[]
  lowStockProducts: LowStockProduct[]
}

async function getDashboardStats(): Promise<DashboardStat> {
  const empty: DashboardStat = {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
  }

  try {
    const [p, o, c, r, ro, ls] = await Promise.allSettled([
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('customers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('total').eq('order_status', 'Delivered'),
      supabaseAdmin.from('orders').select('id,customer_name,total,order_status,created_at').order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.from('products').select('id,name,stock_quantity').lt('stock_quantity', 5).order('stock_quantity', { ascending: true }).limit(10),
    ])

    if (p.status === 'fulfilled') empty.totalProducts = p.value.count ?? 0
    if (o.status === 'fulfilled') empty.totalOrders = o.value.count ?? 0
    if (c.status === 'fulfilled') empty.totalCustomers = c.value.count ?? 0

    if (r.status === 'fulfilled' && r.value.data) {
      empty.totalRevenue = r.value.data.reduce((sum: number, row: any) => sum + (row.total || 0), 0)
    }

    if (ro.status === 'fulfilled') empty.recentOrders = ro.value.data ?? []
    if (ls.status === 'fulfilled') empty.lowStockProducts = ls.value.data ?? []

    return empty
  } catch {
    return empty
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      bg: 'bg-[#C4A97D]/10',
      iconBg: 'bg-[#C4A97D]',
      color: 'text-[#C4A97D]',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-600',
      color: 'text-blue-600',
    },
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-600',
      color: 'text-emerald-600',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-600',
      color: 'text-purple-600',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading text-[#1A1A1A]">
          Admin Panel mein khush amdeed!
        </h1>
        <p className="text-sm text-[#8A8A8A] font-body mt-1">
          Yeh raha aap ka admin dashboard — sab kuch ek nazar mein.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`${card.bg} rounded-lg p-5 border border-[#E8DDD0]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className={`text-2xl font-semibold font-heading ${card.color}`}>
                {card.value}
              </p>
              <p className="text-sm text-[#8A8A8A] font-body mt-1">
                {card.label}
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#E8DDD0] p-5">
          <h2 className="text-base font-heading font-semibold text-[#1A1A1A] mb-4">
            Recent Orders
          </h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-[#8A8A8A] font-body">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DDD0]">
                    <th className="text-left py-2.5 px-3 text-[#8A8A8A] font-body font-medium">Order</th>
                    <th className="text-left py-2.5 px-3 text-[#8A8A8A] font-body font-medium">Customer</th>
                    <th className="text-left py-2.5 px-3 text-[#8A8A8A] font-body font-medium">Total</th>
                    <th className="text-left py-2.5 px-3 text-[#8A8A8A] font-body font-medium">Status</th>
                    <th className="text-left py-2.5 px-3 text-[#8A8A8A] font-body font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#F5F0EA] hover:bg-[#F5F0EA]/50 transition-colors">
                      <td className="py-2.5 px-3 text-[#1A1A1A] font-mono text-xs">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-2.5 px-3 text-[#1A1A1A]">
                        {order.customer_name || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-[#1A1A1A] font-medium">
                        {order.total ? formatPrice(order.total) : '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={cn(
                          'inline-block px-2 py-0.5 rounded text-xs font-medium',
                          order.order_status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                          order.order_status === 'processing' ? 'bg-blue-50 text-blue-700' :
                          order.order_status === 'pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-[#F5F0EA] text-[#8A8A8A]'
                        )}>
                          {order.order_status || '—'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#8A8A8A] text-xs">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-PK') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-[#E8DDD0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-heading font-semibold text-[#1A1A1A]">
              Low Stock Alerts
            </h2>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-[#8A8A8A] font-body">
              No low stock alerts. Sab theek hai!
            </p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-2 border-b border-[#F5F0EA] last:border-0"
                >
                  <span className="text-sm text-[#1A1A1A] font-body truncate max-w-[180px]">
                    {product.name || 'Unnamed Product'}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-50 text-red-600 shrink-0">
                    {product.stock_quantity ?? 0} left
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-base font-heading font-semibold text-[#1A1A1A] mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#6B6B6B] bg-[#F5F0EA] rounded-md hover:bg-[#C4A97D]/10 hover:text-[#C4A97D] transition-colors font-body"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Product
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#6B6B6B] bg-[#F5F0EA] rounded-md hover:bg-[#C4A97D]/10 hover:text-[#C4A97D] transition-colors font-body"
              >
                <List className="w-4 h-4" />
                View All Orders
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#6B6B6B] bg-[#F5F0EA] rounded-md hover:bg-[#C4A97D]/10 hover:text-[#C4A97D] transition-colors font-body"
              >
                <Settings className="w-4 h-4" />
                Site Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
