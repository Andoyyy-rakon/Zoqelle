import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, Star, Heart, CakeSlice, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'All', slug: 'all', icon: Star },
  { name: 'Birthday', slug: 'birthday', icon: Star },
  { name: 'Wedding', slug: 'wedding', icon: Heart },
  { name: 'Cupcakes', slug: 'cupcake', icon: CakeSlice },
  { name: 'Pastries', slug: 'pastry', icon: Truck },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const query = supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        const cat = (p.category || 'uncategorized').toLowerCase();
        const sel = selectedCategory.toLowerCase();
        if (sel === 'custom') {
          return cat.includes('custom') || !p.category || cat.includes('uncategorized');
        }
        return cat === sel;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          (p.category || '').toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      <section className="py-12 md:py-16 px-4 md:px-6 border-b border-outline-variant/60">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-10 md:mb-12 animate-fade-in">
            <span className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-secondary">
              Our Collection
            </span>
            <h1 className="text-3xl md:text-5xl text-on-surface"
              style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
            >
              Discover Your Perfect Cake
            </h1>
            <p className="mt-4 text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Browse our handcrafted selection of luxury cakes, cupcakes, and pastries.
              Every piece is made fresh daily with the finest ingredients.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-surface-bright p-6 border border-outline-variant/80 sticky top-24 animate-slide-up"
                style={{ borderRadius: 'var(--radius-xl)' }}
              >
                <h3 className="mb-4 font-semibold text-on-surface"
                  style={{ fontFamily: 'var(--font-family-display)', fontSize: '18px' }}
                >
                  Categories
                </h3>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-all duration-200 text-left focus-ring ${
                        selectedCategory === cat.slug
                          ? 'bg-primary text-on-primary font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                      }`}
                      style={{ borderRadius: 'var(--radius-md)', fontSize: '14px' }}
                    >
                      <cat.icon className={`h-4 w-4 ${selectedCategory === cat.slug ? 'text-accent-gold' : 'text-on-surface-variant/60'}`} />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-outline-variant">
                  <h3 className="mb-4 font-semibold text-on-surface"
                    style={{ fontFamily: 'var(--font-family-display)', fontSize: '18px' }}
                  >
                    Sort By
                  </h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 pr-10 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors focus-ring"
                      style={{ borderRadius: 'var(--radius-md)', fontSize: '14px' }}
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/70" />
                  <input
                    type="text"
                    placeholder="Search cakes, flavors, occasions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-surface-bright border border-outline-variant text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-accent-gold transition-colors focus-ring"
                    style={{ borderRadius: 'var(--radius-md)', fontSize: '14px' }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary whitespace-nowrap">
                  <span>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                      <div className="aspect-[4/5] skeleton" style={{ borderRadius: 'var(--radius-lg)' }} />
                      <div className="pt-4 space-y-3">
                        <div className="h-3 w-1/3 rounded skeleton" />
                        <div className="h-5 w-3/4 rounded skeleton" />
                        <div className="h-8 w-full rounded skeleton" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 animate-fade-in">
                  <p className="text-red-600 mb-4">Failed to load products: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 text-sm font-semibold text-on-primary focus-ring"
                    style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-md)' }}
                  >
                    Retry
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <CakeSlice className="mx-auto mb-4 h-12 w-12 text-outline" strokeWidth={1.5} />
                  <h3 className="text-xl text-on-surface mb-2"
                    style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
                  >
                    No Products Found
                  </h3>
                  <p className="text-on-surface-variant mb-6 text-sm">
                    {selectedCategory !== 'all' || searchQuery
                      ? 'Try adjusting your filters or search terms'
                      : 'No products available at the moment'}
                  </p>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => handleCategorySelect('all')}
                      className="text-accent-gold font-medium hover:underline focus-ring text-sm"
                    >
                      Show all categories
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}