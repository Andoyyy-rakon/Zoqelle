import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, HeartHandshake, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Checkout() {
  const { profile, user, loading: authLoading } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    notes: '',
  });
  const hasPrefilledRef = useRef(false);

  // Pre-fill form from profile
  useEffect(() => {
    if (profile && !hasPrefilledRef.current) {
      hasPrefilledRef.current = true;
      setFormData({
        shipping_name: profile.name || '',
        shipping_phone: profile.phone || '',
        shipping_address: profile.address || '',
        notes: '',
      });
    }
  }, [profile]);

  // Redirect if not authenticated or cart empty
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
    if (!authLoading && user && items.length === 0 && !orderSuccess) {
      toast.error('Your cart is empty');
      navigate('/cart', { replace: true });
    }
  }, [authLoading, user, items, navigate, orderSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || items.length === 0) return;

    if (!formData.shipping_name.trim() || !formData.shipping_phone.trim() || !formData.shipping_address.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: totalPrice,
          shipping_name: formData.shipping_name.trim(),
          shipping_phone: formData.shipping_phone.trim(),
          shipping_address: formData.shipping_address.trim(),
          notes: formData.notes.trim() || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Decrease product stock
      for (const item of items) {
        await supabase
          .from('products')
          .update({ stock: item.product.stock - item.quantity })
          .eq('id', item.product.id);
      }

      // Clear cart & update status
      clearCart();
      setOrderSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (product: { id: string; image_url?: string | null }) =>
    product.image_url || `https://picsum.photos/seed/${product.id}/400/300.jpg`;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (!user) return null;

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-20" style={{ fontFamily: 'var(--font-family-body)' }}>
        <div className="text-center max-w-md animate-fade-in">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-3 text-3xl font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
            Order Confirmed
          </h1>
          <p className="mb-8 text-on-surface-variant text-sm leading-relaxed">
            Thank you for your order. We are preparing your fresh artisanal cakes and will notify you upon dispatch.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-primary rounded-md transition-colors focus-ring"
            style={{ backgroundColor: 'var(--color-primary-container)' }}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary block mb-1">
              Finalize Order
            </span>
            <h1 className="text-3xl md:text-4xl text-on-surface"
              style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
            >
              Checkout
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Shipping Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface-bright rounded-xl border border-outline-variant/80 p-6 md:p-8 animate-slide-up">
                <h2 className="mb-6 text-xl font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
                  Delivery Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="shipping_name" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="shipping_name"
                        name="shipping_name"
                        value={formData.shipping_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors text-sm focus-ring"
                        style={{ borderRadius: 'var(--radius-md)' }}
                        placeholder="e.g. Maria Santos"
                      />
                    </div>
                    <div>
                      <label htmlFor="shipping_phone" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="shipping_phone"
                        name="shipping_phone"
                        value={formData.shipping_phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors text-sm focus-ring"
                        style={{ borderRadius: 'var(--radius-md)' }}
                        placeholder="+63 9XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="shipping_address" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Delivery Address <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      id="shipping_address"
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors text-sm resize-none focus-ring"
                      style={{ borderRadius: 'var(--radius-md)' }}
                      placeholder="Complete house no., street, barangay, city, province"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Order Notes / Dedication (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors text-sm resize-none focus-ring"
                      style={{ borderRadius: 'var(--radius-md)' }}
                      placeholder="Special instructions or custom cake inscription..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-on-primary transition-colors disabled:opacity-50 focus-ring cursor-pointer"
                    style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-md)' }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing Order...
                      </span>
                    ) : (
                      'Confirm & Place Order'
                    )}
                  </button>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 text-xs text-on-surface-variant pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-gold flex-shrink-0" strokeWidth={1.75} />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-accent-gold flex-shrink-0" strokeWidth={1.75} />
                  <span>Fresh Express Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-accent-gold flex-shrink-0" strokeWidth={1.75} />
                  <span>Handcrafted Daily</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-5">
              <div className="sticky top-24 bg-surface-bright rounded-xl border border-outline-variant/80 p-6 animate-slide-up">
                <h2 className="mb-6 text-xl font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                  {items.map((cartItem) => (
                    <div key={cartItem.product.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-surface-container border border-outline-variant">
                        <img
                          src={getImageUrl(cartItem.product)}
                          alt={cartItem.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-on-surface truncate" style={{ fontFamily: 'var(--font-family-display)' }}>
                          {cartItem.product.name}
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          Qty: {cartItem.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-on-surface">
                          ₱{(cartItem.product.price * cartItem.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <dl className="space-y-3 border-t border-outline-variant/60 pt-4 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <dt>Subtotal ({totalItems} items)</dt>
                    <dd className="font-semibold text-on-surface">₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</dd>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <dt>Shipping Fee</dt>
                    <dd className="font-semibold text-emerald-700">FREE</dd>
                  </div>
                  <div className="flex justify-between border-t border-outline-variant pt-3 text-base">
                    <dt className="font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>Total Amount</dt>
                    <dd className="font-bold text-on-surface">
                      ₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-[11px] text-on-surface-variant text-center leading-relaxed">
                  Cash on Delivery / Direct Bank Transfer upon delivery verification.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}