import { Package, ShoppingCart, Users, DollarSign, AlertTriangle, Loader2, BarChart2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { supabase } from '../lib/supabase';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
  recentOrders: { id: string; created_at: string; total_amount: number; status: string; profiles: { name: string } }[];
  statusCounts: { status: string; count: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchStats = useCallback(async () => {
    try {
      const [
        { count: totalOrders },
        { data: revenueData },
        { count: totalProducts },
        { count: totalCustomers },
        { data: lowStock },
        { data: statusData },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').eq('status', 'delivered'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('products').select('id, name, stock').lt('stock', 5).gt('stock', 0).limit(5),
        supabase.from('orders').select('status'),
      ]);

      let recentOrderData: any[] = [];
      const { data: ordersWithJoin, error: joinError } = await supabase
        .from('orders')
        .select('*, profiles!user_id(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (joinError) {
        console.error('Join query failed, trying fallback:', joinError);
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!ordersError && ordersData) {
          const userIds = [...new Set(ordersData.map(o => o.user_id).filter(Boolean))];
          let profilesMap: Record<string, { name: string }> = {};

          if (userIds.length > 0) {
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, name')
              .in('id', userIds);

            if (profilesData) {
              profilesMap = Object.fromEntries(
                profilesData.map(p => [p.id, { name: p.name }])
              );
            }
          }

          recentOrderData = ordersData.map(order => ({
            ...order,
            profiles: order.user_id ? profilesMap[order.user_id] || { name: 'Guest' } : { name: 'Guest' }
          }));
        }
      } else {
        recentOrderData = ordersWithJoin || [];
      }

      const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
      const statusCounts = statusOrder.map((status) => ({
        status,
        count: statusData?.filter((o) => o.status === status).length || 0,
      }));

      setStats({
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalProducts: totalProducts || 0,
        totalCustomers: totalCustomers || 0,
        lowStockProducts: lowStock || [],
        recentOrders: recentOrderData?.map(o => ({
          id: o.id,
          created_at: o.created_at,
          total_amount: o.total_amount,
          status: o.status,
          profiles: { name: (o as any).profiles?.name || 'Guest' }
        })) || [],
        statusCounts,
      });
    } catch (err) {
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [location.pathname, fetchStats]);

  useEffect(() => {
    const handleOrdersChanged = () => {
      fetchStats();
    };
    
    window.addEventListener('orders-changed', handleOrdersChanged);
    return () => window.removeEventListener('orders-changed', handleOrdersChanged);
  }, [fetchStats]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusBadges: Record<string, string> = {
    pending: 'bg-amber-100/80 text-amber-800 border-amber-300',
    confirmed: 'bg-blue-100/80 text-blue-800 border-blue-300',
    preparing: 'bg-orange-100/80 text-orange-800 border-orange-300',
    ready: 'bg-emerald-100/80 text-emerald-800 border-emerald-300',
    delivered: 'bg-surface-container text-on-surface-variant border-outline-variant',
    cancelled: 'bg-red-100/80 text-red-800 border-red-300',
  };

  const STATS_CHART_COLORS = [
    '#d97706', 
    '#2563eb', 
    '#ea580c', 
    '#059669', 
    '#7c5a28', 
    '#dc2626', 
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-accent-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" style={{ fontFamily: 'var(--font-family-body)' }}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders.toLocaleString() || '0'}
          icon={ShoppingCart}
          iconBg="bg-surface-container"
          iconColor="text-primary"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          iconBg="bg-surface-container"
          iconColor="text-accent-gold"
        />
        <StatCard
          title="Products Listing"
          value={stats?.totalProducts.toLocaleString() || '0'}
          icon={Package}
          iconBg="bg-surface-container"
          iconColor="text-primary"
        />
        <StatCard
          title="Patrons & Customers"
          value={stats?.totalCustomers.toLocaleString() || '0'}
          icon={Users}
          iconBg="bg-surface-container"
          iconColor="text-secondary"
        />
      </div>

      <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 p-6 md:p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-surface-container">
              <BarChart2 className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
                Order Status Distribution
              </h3>
              <p className="text-xs text-on-surface-variant">Live breakdown across order workflow</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-on-primary bg-primary rounded-full">
            {stats?.totalOrders || 0} Total Orders
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stats?.statusCounts || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <YAxis
                type="category"
                dataKey="status"
                tick={{ fontSize: 13, fontFamily: 'Inter', fill: '#2a1c17', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <XAxis type="number" hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#451420',
                  border: '1px solid #b1813f',
                  borderRadius: '12px',
                  color: '#faf5ec',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
                labelStyle={{ color: '#faf5ec', fontWeight: 600, fontFamily: 'Fraunces' }}
                itemStyle={{ color: '#faf5ec' }}
                formatter={(value: any, name: any) => [value ?? 0, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                labelFormatter={(status: any) => String(status).charAt(0).toUpperCase() + String(status).slice(1)}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: '16px', fontFamily: 'Inter', fontSize: '12px', color: '#6c5b4c' }}
              />
              <Bar
                dataKey="count"
                radius={[0, 8, 8, 0]}
                maxBarSize={36}
                label={{
                  position: 'right',
                  offset: 10,
                  fontSize: 13,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fill: '#2a1c17',
                  formatter: (v: any) => (typeof v === 'number' && v > 0 ? v.toString() : ''),
                }}
              >
                {STATS_CHART_COLORS.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 bg-surface-bright rounded-2xl border border-outline-variant/80 p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-2.5 mb-5 border-b border-outline-variant/60 pb-4">
            <AlertTriangle className="h-5 w-5 text-amber-700" />
            <h3 className="text-lg font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
              Low Stock Warning
            </h3>
          </div>
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <ul className="space-y-3" role="list">
              {stats.lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl">
                  <div>
                    <p className="font-semibold text-on-surface text-sm" style={{ fontFamily: 'var(--font-family-display)' }}>
                      {product.name}
                    </p>
                    <p className="text-xs text-amber-800">
                      Only {product.stock} left in stock
                    </p>
                  </div>
                  <Link
                    to={`/products`}
                    className="text-xs font-semibold uppercase tracking-wider text-accent-gold hover:underline focus-ring"
                  >
                    Restock
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-on-surface-variant text-sm">
                All artisanal products are fully stocked
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-surface-bright rounded-2xl border border-outline-variant/80 p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-5 border-b border-outline-variant/60 pb-4">
            <h3 className="text-lg font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
              Recent Patron Orders
            </h3>
            <Link
              to="/orders"
              className="text-xs font-semibold uppercase tracking-wider text-accent-gold hover:underline focus-ring"
            >
              View All Orders →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr className="border-b border-outline-variant/60 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-sm">
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-on-surface">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-3 text-on-surface-variant font-medium">
                        {order.profiles?.name || 'Guest Patron'}
                      </td>
                      <td className="py-3.5 px-3 text-on-surface-variant text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-on-surface">
                        {formatCurrency(Number(order.total_amount))}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${statusBadges[order.status] || 'bg-surface-container text-on-surface-variant border-outline-variant'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-on-surface-variant">
                      No orders placed yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 p-6 transition-all duration-300 hover:shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
            {title}
          </p>
          <p className="mt-2 text-2xl md:text-3xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
            {value}
          </p>
        </div>
        <div className={`p-3.5 rounded-xl border border-outline-variant ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}