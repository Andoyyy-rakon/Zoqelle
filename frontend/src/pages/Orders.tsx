import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Package, Truck, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Order, OrderItem } from '../types';

type OrderWithItems = Order & { order_items: OrderItem[] };

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending Confirmation', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200', icon: <Clock className="h-3.5 w-3.5 text-amber-700" /> },
  confirmed: { label: 'Confirmed', color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200', icon: <Package className="h-3.5 w-3.5 text-blue-700" /> },
  preparing: { label: 'In Baking / Prep', color: 'text-orange-800', bg: 'bg-orange-50 border-orange-200', icon: <Truck className="h-3.5 w-3.5 text-orange-700" /> },
  ready: { label: 'Ready for Dispatch', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle className="h-3.5 w-3.5 text-emerald-700" /> },
  delivered: { label: 'Delivered', color: 'text-slate-800', bg: 'bg-slate-100 border-slate-200', icon: <CheckCircle className="h-3.5 w-3.5 text-slate-700" /> },
  cancelled: { label: 'Cancelled', color: 'text-rose-800', bg: 'bg-rose-50 border-rose-200', icon: <XCircle className="h-3.5 w-3.5 text-rose-700" /> },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        let { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (image_url)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch missing product images if products join is empty
        const allProductIds = [...new Set(
          (data || []).flatMap(o => o.order_items || [])
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
            data?.forEach((order: any) => {
              order.order_items?.forEach((item: any) => {
                if (item.product_id && productImageMap[item.product_id] !== undefined) {
                  if (!item.products) item.products = { image_url: productImageMap[item.product_id] };
                  else if (!item.products.image_url) item.products.image_url = productImageMap[item.product_id];
                }
              });
            });
          }
        }

        setOrders(data || []);
      } catch (err) {
        setError((err as Error).message);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status] || { label: status, color: 'text-slate-800', bg: 'bg-slate-100 border-slate-200', icon: <AlertTriangle className="h-3.5 w-3.5" /> };
  };

  const getItemImageUrl = (item: OrderItem) =>
    item.products?.image_url || item.image_url || (item.product_id ? `https://picsum.photos/seed/${item.product_id}/100/100.jpg` : null);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="animate-pulse flex h-8 w-8 border-4 border-accent-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary block mb-1">
                Order History
              </span>
              <h1 className="text-3xl md:text-4xl text-on-surface"
                style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
              >
                My Orders
              </h1>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-accent-gold border border-accent-gold rounded-md hover:bg-accent-gold hover:text-white transition-colors focus-ring"
            >
              Explore Shop
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md text-rose-800 text-sm" role="alert">
              <p className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4" />
                Error loading orders: {error}
              </p>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-20 animate-fade-in max-w-md mx-auto">
              <Package className="mx-auto mb-4 h-16 w-16 text-outline" strokeWidth={1.5} />
              <h2 className="text-2xl font-semibold text-on-surface mb-2"
                style={{ fontFamily: 'var(--font-family-display)' }}
              >
                No Orders Placed Yet
              </h2>
              <p className="text-on-surface-variant mb-6 text-sm">
                You haven't placed any orders with us yet. Explore our handcrafted creations and indulge today.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-on-primary rounded-md focus-ring"
                style={{ backgroundColor: 'var(--color-primary-container)' }}
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4 animate-slide-up" role="list">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                return (
                  <article
                    key={order.id}
                    className="bg-surface-bright rounded-xl border border-outline-variant/80 overflow-hidden transition-all duration-200 hover:border-outline"
                    role="listitem"
                  >
                    {/* Header Button */}
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="w-full p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left focus-ring cursor-pointer"
                      aria-expanded={expandedOrderId === order.id}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-1.5">
                            <span className="font-mono text-xs font-semibold text-on-surface-variant">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border rounded-full ${statusConfig.color} ${statusConfig.bg}`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-on-surface-variant text-xs">
                            Placed on {formatDate(order.created_at)} · {itemCount} item{itemCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0 border-t md:border-t-0 border-outline-variant/40 pt-3 md:pt-0">
                        <div>
                          <p className="text-base font-semibold text-on-surface">
                            ₱{order.total_amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent-gold">
                          <span>{expandedOrderId === order.id ? 'Hide Details' : 'Details'}</span>
                          {expandedOrderId === order.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Order Items */}
                    {expandedOrderId === order.id && order.order_items && order.order_items.length > 0 && (
                      <div className="border-t border-outline-variant/60 bg-surface/60 p-5 md:p-6 space-y-4 animate-in slide-in-from-top-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                          Order Details & Items
                        </h3>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-surface-bright rounded-lg border border-outline-variant/60">
                              <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-surface-container border border-outline-variant">
                                <img
                                  src={getItemImageUrl(item) || `https://picsum.photos/seed/${item.product_id || 'cake'}/100/100.jpg`}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-on-surface truncate" style={{ fontFamily: 'var(--font-family-display)' }}>
                                  {item.product_name}
                                </h4>
                                <p className="text-xs text-on-surface-variant">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-semibold text-on-surface">
                                  ₱{item.subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="p-3.5 bg-surface-bright rounded-lg border border-outline-variant/60 text-xs">
                            <span className="font-semibold uppercase tracking-wider text-on-surface block mb-1">Notes / Special Instructions:</span>
                            <p className="text-on-surface-variant leading-relaxed">{order.notes}</p>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4 text-xs pt-2 border-t border-outline-variant/40">
                          <div>
                            <span className="font-semibold uppercase tracking-wider text-on-surface-variant block mb-1">Delivery Destination:</span>
                            <p className="text-on-surface font-medium">{order.shipping_name}</p>
                            <p className="text-on-surface-variant">{order.shipping_phone}</p>
                            <p className="text-on-surface-variant leading-relaxed">{order.shipping_address}</p>
                          </div>
                          <div className="text-left md:text-right">
                            <span className="font-semibold uppercase tracking-wider text-on-surface-variant block mb-1">Total Paid:</span>
                            <p className="text-lg font-bold text-on-surface">
                              ₱{order.total_amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}