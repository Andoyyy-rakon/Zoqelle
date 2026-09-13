import { Link } from 'react-router-dom';
import { CakeSlice, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-16 md:py-24"
      style={{ fontFamily: 'var(--font-family-body)' }}
    >
      <div className="mx-auto max-w-2xl text-center animate-fade-in">
        {/* Decorative Pastry Badge */}
        <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-accent-gold/40 bg-surface-bright px-4 py-1.5 shadow-sm">
          <CakeSlice className="h-4 w-4 text-accent-gold" strokeWidth={1.75} />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Page Not Found
          </span>
        </div>

        {/* Large Prominent 404 Display */}
        <div className="relative my-2 select-none">
          <h1
            className="text-8xl md:text-[11rem] font-bold tracking-tighter text-primary/10 leading-none"
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-5xl md:text-7xl font-semibold text-primary tracking-tight"
              style={{ fontFamily: 'var(--font-family-display)' }}
            >
              404
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-3">
          <h2
            className="text-3xl md:text-4xl text-on-surface"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
          >
            Sweetness Seems to Be Missing
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or may have been moved. Let's get you back to something delicious.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-on-primary transition-all hover:opacity-95 focus-ring shadow-sm"
            style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
          >
            <Home className="h-4 w-4" strokeWidth={1.75} />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-primary transition-all hover:brightness-105 active:scale-[0.99] focus-ring shadow-sm"
            style={{ backgroundColor: 'var(--color-accent-gold)', borderRadius: 'var(--radius-md)' }}
          >
            <CakeSlice className="h-4 w-4" strokeWidth={1.75} />
            <span>Browse Our Cakes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
