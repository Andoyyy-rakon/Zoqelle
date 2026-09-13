import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      {/* Header */}
      <section className="relative bg-primary text-on-primary py-14 md:py-18 px-4 md:px-6 text-center">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
            <Shield className="h-4 w-4" strokeWidth={1.75} />
            Legal & Trust
          </span>
          <h1
            className="mb-3 text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
          >
            Privacy Policy
          </h1>
          <p className="text-on-primary-container/90 text-sm md:text-base">
            Last Updated: September 13, 2026
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-3xl bg-surface-bright border border-outline-variant/80 p-6 md:p-10 rounded-xl space-y-8 text-on-surface-variant text-sm md:text-base leading-relaxed">
          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              1. Information We Collect
            </h2>
            <p>
              When you browse our online bakery, place an order, or subscribe to our newsletter, Zoqelle collects necessary personal details including your name, email address, phone number, shipping address, and payment preferences.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To fulfill and deliver your cake and patisserie orders accurately.</li>
              <li>To communicate order status, delivery notifications, and receipt confirmation.</li>
              <li>To send newsletter promotions and exclusive seasonal offers (only if opted in).</li>
              <li>To continuously refine and elevate our patisserie menu and website user experience.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              3. Data Security & Third-Party Services
            </h2>
            <p>
              We implement industry-standard encryption protocols and secure database architecture powered by Supabase. Payment transactions are processed securely through accredited payment gateways. We never store credit card pin details or sell personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              4. Cookies & Analytics
            </h2>
            <p>
              Our website uses essential session cookies to store cart items and preserve authentication state during your visit. You can manage cookie preferences directly in your web browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              5. Contacting Our Data Officer
            </h2>
            <p>
              If you have any questions or wish to request data correction or deletion, please email our privacy team at <a href="mailto:privacy@zoqelle.com" className="text-primary font-medium hover:underline">privacy@zoqelle.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
