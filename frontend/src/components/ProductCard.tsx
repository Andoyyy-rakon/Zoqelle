import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image_url || `https://picsum.photos/seed/${product.id}/400/300.jpg`;
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.is_available || product.stock === 0) return;

    setIsAdding(true);
    try {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`, {
        icon: <ShoppingBag className="h-5 w-5 text-accent-gold" />,
        duration: 2000,
      });
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="group" style={{ fontFamily: 'var(--font-family-body)' }}>
      <Link
        to={`/product/${product.id}`}
        className="block focus-ring"
        aria-label={`View ${product.name} details`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-container" style={{ borderRadius: 'var(--radius-lg)' }}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          {product.is_featured && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-on-primary"
              style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}
            >
              Featured
            </span>
          )}
          {!product.is_available && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-on-primary bg-on-surface-variant"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Unavailable
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-on-primary"
              style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-sm)' }}
            >
              {product.stock} left
            </span>
          )}
        </div>

        <div className="pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
            {product.category || 'Artisanal Creation'}
          </span>

          <h3 className="mt-1.5 mb-1.5 text-[19px] leading-snug text-on-surface group-hover:text-primary-container transition-colors"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 500 }}
          >
            {product.name}
          </h3>

          {product.description && (
            <p className="mb-3 line-clamp-2 text-[13.5px] text-on-surface-variant leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[17px] font-semibold text-on-surface">
              ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold uppercase tracking-wide text-on-primary transition-colors focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary-container)',
                borderRadius: 'var(--radius-md)'
              }}
              disabled={!product.is_available || product.stock === 0 || isAdding}
              onClick={handleAddToCart}
              aria-label={product.is_available && product.stock > 0 ? `Add ${product.name} to cart` : 'Out of stock'}
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : product.is_available && product.stock > 0 ? (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Add
                </>
              ) : (
                'Sold Out'
              )}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}