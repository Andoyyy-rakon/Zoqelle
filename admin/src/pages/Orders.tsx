import { useEffect, useState } from 'react';
import {
  Package,
  Loader2,
  ChevronDown,
  ChevronUp,
  Search,
  User,
  Mail,
  Phone,
  Package as PackageIcon,
  AlertTriangle,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types';

type OrderWithItems = Order & { order_items: OrderItem[]; profiles: { name: string; email: string; phone: string } | null };

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  pending: { label: 'Pending', badgeClass: 'bg-amber-100/80 text-amber-800 border-amber-300' },
  confirmed: { label: 'Confirmed', badgeClass: 'bg-blue-100/80 text-blue-800 border-blue-300' },
  preparing: { label: 'Preparing', badgeClass: 'bg-orange-100/80 text-orange-800 border-orange-300' },
  ready: { label: 'Ready for Delivery', badgeClass: 'bg-emerald-100/80 text-emerald-800 border-emerald-300' },
  delivered: { label: 'Delivered', badgeClass: 'bg-surface-container text-on-surface-variant border-outline-variant' },
  cancelled: { label: 'Cancelled', badgeClass: 'bg-red-100/80 text-red-800 border-red-300' },
};

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const OrderCard = ({
  order,
  isExpanded,
  onToggle,
  onUpdateStatus,
  onDelete,
}: {
  order: OrderWithItems;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onDelete: (orderId: string) => void;
}) => {
  const statusConfig = STATUS_CONFIG[order.status] || { label: order.status, badgeClass: 'bg-surface-container text-on-surface-variant border-outline-variant' };
  const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <article className="bg-surface-bright rounded-2xl border border-outline-variant/80 overflow-hidden lg:hidden animate-fade-in mb-4">
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex flex-col gap-3 text-left hover:bg-surface-container/40 transition-colors focus-ring cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-on-surface">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${statusConfig.badgeClass}`}>
                {statusConfig.label}
              </span>
            </div>
            <p className="text-on-surface-variant text-xs">
              {order.profiles?.name || 'Guest Patron'} · {itemCount} item{itemCount !== 1 ? 's' : ''} · {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
          <div>
            <p className="text-base font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
              {formatCurrency(order.total_amount)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-accent-gold text-xs font-semibold uppercase tracking-wider">
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-surface p-4 border-t border-outline-variant/60 space-y-4">
          {/* Order Items */}
          {order.order_items && order.order_items.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-on-surface uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-display)' }}>
                Order Items ({itemCount})
              </h4>
              <div className="space-y-2.5">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-surface-bright rounded-xl border border-outline-variant/60">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-outline-variant/60 bg-surface-container">
                      {(item.products?.image_url || item.image_url) ? (
                        <img
                          src={item.products?.image_url || item.image_url!}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageIcon className="h-5 w-5 text-accent-gold" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-on-surface text-sm truncate" style={{ fontFamily: 'var(--font-family-display)' }}>
                        {item.product_name}
                      </h5>
                      <p className="text-xs text-on-surface-variant">
                        Qty: {item.quantity} × {formatCurrency(item.product_price)}
                      </p>
                      <p className="text-xs font-semibold text-on-surface mt-0.5">
                        Subtotal: {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer & Shipping Info */}
          <div className="grid gap-3">
            <div className="bg-surface-bright rounded-xl border border-outline-variant/60 p-4 space-y-2 text-xs">
              <h4 className="text-sm font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
                Patron Details
              </h4>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <User className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                <span className="font-medium text-on-surface">{order.profiles?.name || 'Guest Patron'}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Mail className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                <span>{order.profiles?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Phone className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                <span>{order.profiles?.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="bg-surface-bright rounded-xl border border-outline-variant/60 p-4 text-xs space-y-1">
              <h4 className="text-sm font-semibold text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Delivery Destination
              </h4>
              <p className="font-medium text-on-surface">{order.shipping_name}</p>
              <p className="text-on-surface-variant">{order.shipping_phone}</p>
              <p className="text-on-surface-variant">{order.shipping_address}</p>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-surface-bright rounded-xl border border-outline-variant/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Workflow Progress
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((status) => {
                const config = STATUS_CONFIG[status];
                const isCurrent = status === order.status;
                const isNext = STATUS_ORDER.indexOf(status) === currentStatusIndex + 1;
                const isPrevious = currentStatusIndex > 0 && STATUS_ORDER.indexOf(status) < currentStatusIndex;
                const disabled = isCurrent || isPrevious;

                return (
                  <button
                    key={status}
                    onClick={() => !disabled && onUpdateStatus(order.id, status as Order['status'])}
                    disabled={disabled}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-ring ${
                      isCurrent
                        ? `${config.badgeClass} cursor-default`
                        : disabled
                        ? 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/40'
                        : isNext
                        ? 'bg-primary text-on-primary shadow-sm hover:opacity-90'
                        : 'bg-surface-bright border border-outline-variant text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delete Order */}
          <div className="pt-2">
            <button
              onClick={() => onDelete(order.id)}
              className="w-full py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors focus-ring"
            >
              Delete Order Record
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

const OrderTableRow = ({
  order,
  isExpanded,
  onToggle,
  onUpdateStatus,
  onDelete,
}: {
  order: OrderWithItems;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onDelete: (orderId: string) => void;
}) => {
  const statusConfig = STATUS_CONFIG[order.status] || { label: order.status, badgeClass: 'bg-surface-container text-on-surface-variant border-outline-variant' };
  const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <>
      <tr 
        className="border-b border-outline-variant/40 hover:bg-surface-container/40 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="py-4 px-6">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-semibold text-on-surface">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${statusConfig.badgeClass}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {order.profiles?.name || 'Guest Patron'} · {itemCount} item{itemCount !== 1 ? 's' : ''} · {formatDate(order.created_at)}
              </p>
            </div>
          </div>
        </td>
        <td className="py-4 px-6 hidden md:table-cell text-right">
          <p className="text-base font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
            {formatCurrency(order.total_amount)}
          </p>
        </td>
        <td className="py-4 px-6 hidden md:table-cell text-right">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-gold">
            <span>{isExpanded ? 'Close' : 'Details'}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={3} className="p-0 border-b border-outline-variant/60">
            <div className="bg-surface p-6 space-y-6 animate-fade-in">
              {/* Order Items */}
              {order.order_items && order.order_items.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-on-surface uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-display)' }}>
                    Items Ordered ({itemCount})
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-surface-bright rounded-xl border border-outline-variant/60">
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border border-outline-variant/60 bg-surface-container">
                          {(item.products?.image_url || item.image_url) ? (
                            <img
                              src={item.products?.image_url || item.image_url!}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PackageIcon className="h-6 w-6 text-accent-gold" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-on-surface text-sm truncate" style={{ fontFamily: 'var(--font-family-display)' }}>
                            {item.product_name}
                          </h5>
                          <p className="text-xs text-on-surface-variant">
                            Qty: {item.quantity} × {formatCurrency(item.product_price)}
                          </p>
                          <p className="text-xs font-semibold text-on-surface mt-1">
                            Subtotal: {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer & Shipping Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface-bright rounded-xl border border-outline-variant/60 p-4 text-xs space-y-2">
                  <h4 className="text-sm font-semibold text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                    Patron Profile
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Name:</span>
                    <span className="font-semibold text-on-surface">{order.profiles?.name || 'Guest Patron'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Email:</span>
                    <span className="font-medium text-on-surface">{order.profiles?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Phone:</span>
                    <span className="font-medium text-on-surface">{order.profiles?.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-surface-bright rounded-xl border border-outline-variant/60 p-4 text-xs space-y-1">
                  <h4 className="text-sm font-semibold text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                    Shipping Address
                  </h4>
                  <p className="font-semibold text-on-surface">{order.shipping_name}</p>
                  <p className="text-on-surface-variant">{order.shipping_phone}</p>
                  <p className="text-on-surface-variant">{order.shipping_address}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-surface-bright rounded-xl border border-outline-variant/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Update Workflow Status
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}>
                    Current: {statusConfig.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_ORDER.map((status) => {
                    const config = STATUS_CONFIG[status];
                    const isCurrent = status === order.status;
                    const isNext = STATUS_ORDER.indexOf(status) === currentStatusIndex + 1;
                    const isPrevious = currentStatusIndex > 0 && STATUS_ORDER.indexOf(status) < currentStatusIndex;
                    const disabled = isCurrent || isPrevious;

                    return (
                      <button
                        key={status}
                        onClick={() => !disabled && onUpdateStatus(order.id, status as Order['status'])}
                        disabled={disabled}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all focus-ring ${
                          isCurrent
                            ? `${config.badgeClass} cursor-default`
                            : disabled
                            ? 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/40'
                            : isNext
                            ? 'bg-primary text-on-primary shadow-sm hover:opacity-90'
                            : 'bg-surface-bright border border-outline-variant text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delete Order */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onDelete(order.id)}
                  className="px-5 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors focus-ring cursor-pointer"
                >
                  Delete Order Record
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Modal State for Order Deletion
  const [deleteModalOrderId, setDeleteModalOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (image_url)
            ),
            profiles!user_id(id, name, email, phone)
          `)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.log('Join failed, trying fallback query...');
          const { data: ordersWithoutJoin, error: ordersNoJoinError } = await supabase
            .from('orders')
            .select('*, order_items(*, products(image_url))')
            .order('created_at', { ascending: false });

          if (ordersNoJoinError) throw ordersNoJoinError;

          const userIds = [...new Set(ordersWithoutJoin?.map(o => o.user_id).filter(Boolean) || [])];
          let profilesMap: Record<string, { id: string; name: string; email: string; phone: string }> = {};

          if (userIds.length > 0) {
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, name, email, phone')
              .in('id', userIds);

            if (profilesData) {
              profilesMap = Object.fromEntries(
                profilesData.map(p => [p.id, { name: p.name, email: p.email, phone: p.phone }])
              );
            }
          }

          ordersData = ordersWithoutJoin?.map(order => ({
            ...order,
            profiles: order.user_id ? profilesMap[order.user_id] || null : null
          })) || [];
          ordersError = null;
        }

        if (ordersError) throw ordersError;

        // Fetch missing images
        const allProductIds = [...new Set(
          (ordersData || []).flatMap(o => o.order_items || [])
            .filter(i => i.product_id && !i.products?.image_url)
            .map(i => i.product_id as string)
        )];

        if (allProductIds.length > 0) {
          const { data: productsData } = await supabase
            .from('products')
            .select('id, image_url')
            .in('id', allProductIds);

          if (productsData && productsData.length > 0) {
            const productImageMap = Object.fromEntries(productsData.map(p => [p.id, p.image_url]));
            ordersData?.forEach((order: any) => {
              order.order_items?.forEach((item: any) => {
                if (item.product_id && productImageMap[item.product_id] !== undefined) {
                  if (!item.products) item.products = { image_url: productImageMap[item.product_id] };
                  else if (!item.products.image_url) item.products.image_url = productImageMap[item.product_id];
                }
              });
            });
          }
        }

        setOrders(ordersData || []);
      } catch (err) {
        console.error('Orders fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.profiles?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.shipping_name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (newStatus === 'cancelled' && !window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      alert('Failed to update status');
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalOrderId) return;

    setIsDeleting(true);
    const orderId = deleteModalOrderId;

    try {
      const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', orderId);
      if (itemsError) {
        alert(`Failed to delete order items: ${itemsError.message}`);
        return;
      }

      const { error, data: deleteData } = await supabase.from('orders').delete().eq('id', orderId).select();
      if (error || !deleteData || deleteData.length === 0) {
        alert('Cannot delete order due to database permissions.');
        return;
      }

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setExpandedOrderId(null);
      window.dispatchEvent(new Event('orders-changed'));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting order');
    } finally {
      setIsDeleting(false);
      setDeleteModalOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-accent-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" style={{ fontFamily: 'var(--font-family-body)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
            Patron Orders
          </h1>
          <p className="text-sm text-on-surface-variant">
            Track order status, customer details, and fulfillment workflow
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer name, or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-surface border border-outline-variant/80 rounded-xl text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-outline-variant/80 rounded-xl text-on-surface focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm font-medium"
          >
            <option value="all">All Statuses</option>
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {STATUS_CONFIG[status].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto mb-4 h-14 w-14 text-outline" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
              No orders found
            </h3>
            <p className="text-sm text-on-surface-variant">
              {search || statusFilter !== 'all' ? 'Try adjusting your search filters' : 'No patron orders placed yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="lg:hidden p-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  onToggle={() => toggleOrder(order.id)}
                  onUpdateStatus={updateOrderStatus}
                  onDelete={(id) => setDeleteModalOrderId(id)}
                />
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <table className="w-full text-left" role="table">
                <tbody>
                  {filteredOrders.map((order) => (
                    <OrderTableRow
                      key={order.id}
                      order={order}
                      isExpanded={expandedOrderId === order.id}
                      onToggle={() => toggleOrder(order.id)}
                      onUpdateStatus={updateOrderStatus}
                      onDelete={(id) => setDeleteModalOrderId(id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-bright border border-outline-variant/80 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scale-in space-y-5">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-red-100/80 border border-red-200 flex items-center justify-center text-red-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setDeleteModalOrderId(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-lg hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Delete Order Record?
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Are you sure you want to delete order <span className="font-mono font-semibold text-on-surface">#{deleteModalOrderId.slice(0, 8).toUpperCase()}</span>? This action cannot be undone and will remove all item details permanently.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOrderId(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold uppercase tracking-wider text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}