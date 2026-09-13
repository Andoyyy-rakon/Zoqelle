import { Plus, Package, Search, Loader2, Trash2, Edit2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductForm from '../components/ProductForm';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(amount);

const getStatusBadge = (product: Product) => {
  if (!product.is_available) return { label: 'Hidden', className: 'bg-red-100/80 text-red-800 border-red-300' };
  if (product.is_featured) return { label: 'Featured', className: 'bg-amber-100/80 text-amber-800 border-amber-300' };
  return { label: 'Available', className: 'bg-emerald-100/80 text-emerald-800 border-emerald-300' };
};

const getStockColor = (stock: number) =>
  stock === 0 ? 'text-red-700 font-bold' : stock < 10 ? 'text-amber-700 font-semibold' : 'text-emerald-800 font-medium';

const ProductCard = ({ product, onEdit, onDelete, deletingId }: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}) => (
  <article className="bg-surface-bright rounded-2xl border border-outline-variant/80 p-4 sm:p-5 shadow-sm transition-all lg:hidden">
    <div className="flex gap-4">
      <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden border border-outline-variant/80 bg-surface-container">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-8 w-8 text-accent-gold" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-on-surface truncate text-base" style={{ fontFamily: 'var(--font-family-display)' }}>
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(product).className}`}>
              {getStatusBadge(product).label}
            </span>
          </div>
        </div>
        {product.description && (
          <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
            {product.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary bg-surface-container border border-outline-variant rounded-full">
            {product.category || 'Uncategorized'}
          </span>
          <span className="text-on-surface font-semibold">
            {formatCurrency(product.price)}
          </span>
          <span className={`text-xs ${getStockColor(product.stock)}`}>
            ({product.stock} stock)
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-outline-variant/60">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-on-surface-variant hover:text-accent-gold hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
            aria-label={`Edit ${product.name}`}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            disabled={deletingId === product.id}
            className="p-2 text-on-surface-variant hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            aria-label={`Delete ${product.name}`}
          >
            {deletingId === product.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  </article>
);

const ProductTableRow = ({ product, onEdit, onDelete, deletingId }: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}) => (
  <tr key={product.id} className="border-b border-outline-variant/40 hover:bg-surface-container/40 transition-colors">
    <td className="py-4 px-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl overflow-hidden border border-outline-variant/80 bg-surface-container flex-shrink-0">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-5 w-5 text-accent-gold" />
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-on-surface text-base" style={{ fontFamily: 'var(--font-family-display)' }}>
            {product.name}
          </p>
          {product.description && (
            <p className="text-xs text-on-surface-variant truncate max-w-xs">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </td>
    <td className="py-4 px-6 hidden md:table-cell">
      <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary bg-surface-container border border-outline-variant/80 rounded-full">
        {product.category || 'Uncategorized / Custom'}
      </span>
    </td>
    <td className="py-4 px-6 text-on-surface font-semibold hidden md:table-cell">
      {formatCurrency(product.price)}
    </td>
    <td className="py-4 px-6 hidden md:table-cell">
      <span className={getStockColor(product.stock)}>{product.stock} units</span>
    </td>
    <td className="py-4 px-6 hidden md:table-cell">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${getStatusBadge(product).className}`}>
        {getStatusBadge(product).label}
      </span>
    </td>
    <td className="py-4 px-6 text-right">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(product)}
          className="p-2 text-on-surface-variant hover:text-accent-gold hover:bg-surface-container rounded-lg transition-colors focus-ring"
          aria-label={`Edit ${product.name}`}
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          disabled={deletingId === product.id}
          className="p-2 text-on-surface-variant hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus-ring disabled:opacity-50"
          aria-label={`Delete ${product.name}`}
        >
          {deletingId === product.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </td>
  </tr>
);

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Products fetch error:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSaved = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const query = search.toLowerCase();
    const cat = (p.category || 'uncategorized').toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      cat.includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  });

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
            Product Catalog
          </h1>
          <p className="text-sm text-on-surface-variant">
            Manage bakery inventory, stock levels, and product availability
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-on-primary rounded-xl transition-colors focus-ring"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category, or description..."
            className="w-full pl-11 pr-4 py-2.5 bg-surface border border-outline-variant/80 rounded-xl text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto mb-4 h-14 w-14 text-outline" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
              {search ? 'No products match search' : 'No products in catalog'}
            </h3>
            <p className="text-on-surface-variant mb-6 text-sm">
              {search ? 'Try adjusting your search keywords' : 'Add your first cake or pastry to get started'}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-on-primary rounded-xl focus-ring"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-outline-variant/60 p-4 space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left" role="table">
                <thead className="bg-surface-container/40 border-b border-outline-variant/60">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Stock</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <ProductForm
          product={null}
          onSuccess={handleProductSaved}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSuccess={handleProductSaved}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}