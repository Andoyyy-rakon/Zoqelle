import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, Minus, Plus, Trash2, ShieldCheck, Truck, HeartHandshake, Package, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleRemoveConfirm = () => {
    if (itemToRemove) {
      const item = items.find((i) => i.product.id === itemToRemove);
      removeFromCart(itemToRemove);
      if (item) {
        toast.success(`Removed "${item.product.name}" from cart`);
      }
      setItemToRemove(null);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;
    const clampedQty = Math.max(1, Math.min(newQuantity, item.product.stock));
    updateQuantity(productId, clampedQty);
  };

  const getImageUrl = (product: { id: string; image_url?: string | null }) =>
    product.image_url || `https://picsum.photos/seed/${product.id}/400/300.jpg`;

  const renderEmptyCart = () => (
    <div className="text-center py-20 animate-fade-in max-w-md mx-auto">
      <Package className="mx-auto mb-6 h-16 w-16 text-outline" strokeWidth={1.5} />
      <h2 className="text-2xl md:text-3xl font-semibold text-on-surface mb-3"
        style={{ fontFamily: 'var(--font-family-display)' }}
      >
        Your Cart is Empty
      </h2>
      <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">
        Looks like you haven't added any cakes yet. Browse our collection and find your perfect treat.
      </p>
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-on-primary transition-colors focus-ring"
        style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-md)' }}
      >
        Explore Our Shop
      </Link>
    </div>
  );

  const renderCartContent = () => (
    <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
      
      <div className="lg:col-span-8 space-y-4 animate-slide-up">
        {items.map((cartItem) => (
          <article
            key={cartItem.product.id}
            className="flex flex-col sm:flex-row gap-5 p-4 bg-surface-bright rounded-xl border border-outline-variant/70 transition-all duration-200 hover:border-outline focus-ring"
          >
            
            <div className="relative w-full sm:w-36 flex-shrink-0 aspect-[4/3] sm:aspect-square overflow-hidden rounded-lg bg-surface-container">
              <img
                src={getImageUrl(cartItem.product)}
                alt={cartItem.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
                      {cartItem.product.category}
                    </span>
                    <h3 className="text-lg font-medium text-on-surface truncate"
                      style={{ fontFamily: 'var(--font-family-display)' }}
                    >
                      {cartItem.product.name}
                    </h3>
                    <p className="mt-1 text-on-surface font-semibold text-base">
                      ₱{cartItem.product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button
                    onClick={() => setItemToRemove(cartItem.product.id)}
                    className="p-1.5 text-on-surface-variant/70 hover:text-rose-600 hover:bg-surface-container rounded-md transition-colors focus-ring cursor-pointer"
                    aria-label={`Remove ${cartItem.product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Qty</span>
                    <div className="flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface">
                      <button
                        onClick={() => handleQuantityChange(cartItem.product.id, cartItem.quantity - 1)}
                        disabled={cartItem.quantity <= 1}
                        className="px-2.5 py-1.5 text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-on-surface">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(cartItem.product.id, cartItem.quantity + 1)}
                        disabled={cartItem.quantity >= cartItem.product.stock}
                        className="px-2.5 py-1.5 text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-on-surface-variant block uppercase tracking-wider">Subtotal</span>
                    <span className="text-base font-semibold text-on-surface">
                      ₱{(cartItem.product.price * cartItem.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-24 bg-surface-bright rounded-xl border border-outline-variant/80 p-6 animate-slide-up">
          <h2 className="mb-6 text-xl font-semibold text-on-surface"
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            Order Summary
          </h2>

          <dl className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <dt>Subtotal ({totalItems} items)</dt>
              <dd className="font-semibold text-on-surface">₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</dd>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <dt>Shipping</dt>
              <dd className="font-semibold text-secondary">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between border-t border-outline-variant pt-4 text-base">
              <dt className="font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>Total</dt>
              <dd className="font-bold text-on-surface">
                ₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </dd>
            </div>
          </dl>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-on-primary transition-colors focus-ring cursor-pointer"
              style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-md)' }}
            >
              Proceed to Checkout
            </button>
            <Link
              to="/shop"
              className="block w-full text-center px-6 py-3 text-xs font-semibold uppercase tracking-wide text-primary border border-outline-variant rounded-md hover:bg-surface-container transition-colors focus-ring"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-outline-variant/60 space-y-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
              <span>100% Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
              <span>Fresh Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
              <span>Handcrafted Daily</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary block mb-1">
                Shopping Bag
              </span>
              <h1 className="text-3xl md:text-4xl text-on-surface"
                style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
              >
                Your Cart
              </h1>
            </div>
            {items.length > 0 && (
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-gold hover:underline focus-ring"
              >
                <ChevronLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            )}
          </div>

          {items.length === 0 ? renderEmptyCart() : renderCartContent()}
        </div>
      </section>

      {itemToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="remove-modal-title">
          <div className="w-full max-w-md bg-surface-bright rounded-xl p-6 border border-outline-variant shadow-xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 id="remove-modal-title" className="text-lg font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
                Remove Item
              </h2>
              <button
                onClick={() => setItemToRemove(null)}
                className="p-1 text-on-surface-variant hover:text-primary transition-colors focus-ring"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-on-surface-variant text-sm">
              Are you sure you want to remove <strong className="text-on-surface">"{items.find((i) => i.product.id === itemToRemove)?.product.name}"</strong> from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setItemToRemove(null)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-surface border border-outline-variant rounded-md hover:bg-surface-container transition-colors focus-ring"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveConfirm}
                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-rose-700 rounded-md hover:bg-rose-800 transition-colors focus-ring"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}