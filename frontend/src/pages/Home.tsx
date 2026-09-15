import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CakeSlice, ArrowRight, ArrowUpRight, Truck, ShieldCheck, HeartHandshake, PenTool } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import HeroImage from '../assets/hero.jpeg';
import HeroVideo from '../assets/hero-video.mp4';
import BirthdayImg from '../assets/Birthday_cake_on_stand_202609062136.jpeg';
import WeddingImg from '../assets/Wedding_cake_on_cake_stand_202609062136.jpeg';
import CupcakeImg from '../assets/Gourmet_cupcakes_on_serving_stand_202609062136.jpeg';
import PastryImg from '../assets/Pastries_arranged_on_ceramic_plate_202609062136.jpeg';

const categories = [
  { name: 'Birthday Cakes', slug: 'birthday', image: BirthdayImg },
  { name: 'Wedding Cakes', slug: 'wedding', image: WeddingImg },
  { name: 'Cupcakes', slug: 'cupcake', image: CupcakeImg },
  { name: 'Pastries', slug: 'pastry', image: PastryImg },
];

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders over ₱2,000' },
  { icon: ShieldCheck, title: 'Fresh Guarantee', desc: 'Baked fresh daily' },
  { icon: HeartHandshake, title: 'Made with Love', desc: 'Handcrafted by artisans' },
  { icon: PenTool, title: 'Artisanal Quality', desc: 'Baked to perfection' },
];

const sectionClassName = 'py-16 md:py-24 px-4 md:px-6';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .eq('is_available', true)
          .limit(4)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      
      <section className="relative overflow-hidden border-b border-outline-variant/60">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-14 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="animate-slide-up pt-4">
              <h1
                className="mb-6 text-[2.6rem] leading-[1.08] md:text-6xl lg:text-[4rem] text-on-surface"
                style={{ fontFamily: 'var(--font-family-display)', letterSpacing: '-0.01em', fontWeight: 600 }}
              >
                Freshly Baked,
                <br />
                <span className="italic text-primary-container">Made with Love</span>
              </h1>

              <p className="mb-9 text-base md:text-lg text-on-surface-variant leading-relaxed max-w-md" style={{ lineHeight: '1.7' }}>
                Experience the art of fine patisserie. Every cake at Zoqelle is a masterpiece —
                crafted with premium ingredients, precise technique, and a passion for perfection.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-5 mb-12">
                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-on-primary transition-colors focus-ring"
                  style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-on-surface-variant border-t border-outline-variant pt-6">
                <div className="flex items-center gap-2">
                  <CakeSlice className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
                  <span>Est. 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
                  <span>100% Natural Ingredients</span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in lg:mt-0">
              <div className="relative overflow-hidden aspect-[4/5] md:aspect-[5/6]" style={{ borderRadius: 'var(--radius-2xl)' }}>
                <img
                  src={HeroImage}
                  alt="Zoqelle celebration cake"
                  className={`h-full w-full object-cover transition-opacity duration-700 ${
                    videoLoaded && !videoError ? 'opacity-0 absolute inset-0' : 'opacity-100'
                  }`}
                />
                {!videoError && (
                  <video
                    src={HeroVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setVideoLoaded(true)}
                    onError={() => setVideoError(true)}
                    className={`h-full w-full object-cover transition-opacity duration-700 ${
                      videoLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14 animate-fade-in">
            <div>
              <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.16em] text-secondary">
                Our Categories
              </span>
              <h2
                className="text-3xl md:text-4xl text-on-surface"
                style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
              >
                Explore Our Collections
              </h2>
            </div>
            <p className="text-on-surface-variant max-w-sm text-[15px] leading-relaxed">
              From elegant wedding cakes to delightful cupcakes, find the perfect treat for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-slide-up">
            {categories.map(({ name, slug, image }) => (
              <Link
                key={slug}
                to={`/shop?category=${slug}`}
                className="group relative block aspect-[3/4] overflow-hidden focus-ring"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <img
                  src={image}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
                  <h3
                    className="text-white text-[15px] md:text-base leading-snug"
                    style={{ fontFamily: 'var(--font-family-display)', fontWeight: 500 }}
                  >
                    {name}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-white/75 group-hover:text-accent-gold transition-colors">
                    View Collection
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionClassName} bg-surface-bright border-y border-outline-variant/60`}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16 animate-fade-in">
            <span className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-secondary">
              Featured Creations
            </span>
            <h2
              className="text-3xl md:text-4xl text-on-surface"
              style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
            >
              Our Featured Cakes
            </h2>
            <p className="mt-4 text-on-surface-variant max-w-xl text-[15px] leading-relaxed">
              Handpicked favorites from our master patissiers. Each one tells a story of flavor and artistry.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in">
              {[1, 2, 3, 4].map((i) => (
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
              <p className="text-red-600 mb-4">Failed to load featured products: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-sm font-semibold text-on-primary focus-ring"
                style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-md)' }}
              >
                Retry
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <CakeSlice className="mx-auto mb-4 h-10 w-10 text-outline" strokeWidth={1.5} />
              <h3 className="text-xl text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}>
                No Featured Cakes Yet
              </h3>
              <p className="text-on-surface-variant mb-6">Check back soon for our handpicked favorites!</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-on-primary focus-ring"
                style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: 'var(--radius-md)' }}
              >
                Browse All Cakes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-slide-up">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-14 text-center animate-fade-in">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold text-on-primary transition-colors focus-ring"
                  style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
                >
                  View All Cakes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className={sectionClassName}>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant animate-slide-up">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center px-3 md:px-6">
                <feature.icon className="h-6 w-6 mb-4 text-accent-gold" strokeWidth={1.5} />
                <h3
                  className="mb-1.5 text-on-surface text-[15px] md:text-base"
                  style={{ fontFamily: 'var(--font-family-display)', fontWeight: 500 }}
                >
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant text-[13px] md:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
        <p
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center whitespace-nowrap text-on-primary/[0.05]"
          style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(5rem, 16vw, 12rem)', fontWeight: 600 }}
        >
          Zoqelle
        </p>
        <div className="relative mx-auto max-w-3xl text-center px-4 py-20 md:py-28">
          <span className="mx-auto mb-5 block h-px w-12 bg-accent-gold" />
          <h2
            className="mb-5 text-3xl md:text-4xl italic text-on-primary"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 500 }}
          >
            Ready for Something Extraordinary?
          </h2>
          <p className="mb-9 text-on-primary-container/90 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Let us create a masterpiece for your next celebration. Custom designs,
            personalized flavors, and unforgettable moments — all crafted just for you.
          </p>
          <Link
            to="/shop?category=custom"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold transition-colors focus-ring"
            style={{
              backgroundColor: 'var(--color-accent-gold)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            Start Your Custom Order
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}