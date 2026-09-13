import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, ShieldCheck, Truck, HeartHandshake, Package, ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useCart } from '../hooks/useCart';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);

        // Fetch related products (same category, exclude current, limit 4)
        if (data?.category) {
          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .eq('is_available', true)
            .neq('id', id)
            .limit(4);
          setRelatedProducts(related || []);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Quantity controls
  const incrementQty = () => {
    if (product && quantity < product.stock) setQuantity(q => q + 1);
  };
  const decrementQty = () => setQuantity(q => Math.max(1, q - 1));

  // Add to cart
  const handleAddToCart = () => {
    if (!product || !product.is_available || product.stock === 0) return;
    setIsAdding(true);
    try {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.name} to cart!`, {
        icon: <ShoppingBag className="h-5 w-5 text-accent-gold" />,
        duration: 2500,
      });
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  // Stock status
  const getStockStatus = () => {
    if (!product) return null;
    if (!product.is_available || product.stock === 0) return { text: 'Out of Stock' };
    if (product.stock < 10) return { text: `Only ${product.stock} left in stock` };
    return { text: 'In Stock — Freshly Baked Daily' };
  };

  const stockStatus = getStockStatus();

  // Placeholder image
  const getImageUrl = (p: Product) => p.image_url || `https://picsum.photos/seed/${p.id}/600/600.jpg`;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <div className="aspect-[4/5] bg-surface-dim rounded-2xl skeleton" />
            <div className="space-y-6">
              <div className="h-4 w-24 rounded skeleton" />
              <div className="h-10 w-3/4 rounded skeleton" />
              <div className="h-8 w-1/3 rounded skeleton" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded skeleton" />
                <div className="h-4 w-4/5 rounded skeleton" />
              </div>
              <div className="h-14 w-full rounded skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center py-20" style={{ fontFamily: 'var(--font-family-body)' }}>
        <div className="text-center px-4 animate-fade-in max-w-md">
          <Package className="mx-auto mb-4 h-12 w-12 text-outline" strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
            Product Not Found
          </h2>
          <p className="text-on-surface-variant mb-6 text-sm">
            {error ? `Error: ${error}` : 'This cake does not exist or is currently unavailable.'}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-on-primary focus-ring"
            style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(product);

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-on-surface-variant/70" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors focus-ring">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/shop" className="hover:text-primary transition-colors focus-ring">Shop</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-on-surface font-semibold truncate max-w-xs" aria-current="page">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start animate-slide-up">
            {/* LEFT: Product Image */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container border border-outline-variant/60" style={{ borderRadius: 'var(--radius-2xl)' }}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.is_featured && (
                  <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-on-primary"
                    style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}
                  >
                    Featured Creation
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:pt-2">
              {/* Category Badge */}
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary mb-3">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="mb-4 text-3xl md:text-4xl leading-tight text-on-surface"
                style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
              >
                {product.name}
              </h1>

              {/* Price & Stock */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/60">
                <span className="text-2xl md:text-3xl font-semibold text-on-surface">
                  ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
                {stockStatus && (
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-primary-container)' }}
                  >
                    {stockStatus.text}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="mb-8 text-on-surface-variant text-[15px] leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Quantity Selector + Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 p-5 bg-surface-bright border border-outline-variant/80"
                style={{ borderRadius: 'var(--radius-xl)' }}
              >
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Quantity</span>
                  <div className="flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface">
                    <button
                      onClick={decrementQty}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-semibold text-sm text-on-surface">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQty}
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_available || product.stock === 0 || isAdding}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-on-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-primary-container)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  {isAdding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : product.is_available && product.stock > 0 ? (
                    <>
                      <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                      Add {quantity > 1 ? `(${quantity})` : ''} to Cart
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 text-xs text-on-surface-variant border-t border-outline-variant/60 pt-6">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
                  <span>100% Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
                  <span>Fresh Express Delivery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
                  <span>Handcrafted Daily</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Package className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
                  <span>Signature Packaging</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 border-t border-outline-variant/60 pt-16 animate-slide-up" aria-labelledby="related-heading">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                    You Might Also Like
                  </span>
                  <h2 id="related-heading" className="text-2xl md:text-3xl text-on-surface"
                    style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
                  >
                    Related Creations
                  </h2>
                </div>
                <Link
                  to={`/shop?category=${product.category}`}
                  className="text-xs font-semibold uppercase tracking-wider text-accent-gold hover:underline focus-ring"
                >
                  View All {product.category}s &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}