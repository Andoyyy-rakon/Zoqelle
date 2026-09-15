import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      
      <section className="relative bg-primary text-on-primary py-14 md:py-18 px-4 md:px-6 text-center">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
            <FileText className="h-4 w-4" strokeWidth={1.75} />
            Service Agreement
          </span>
          <h1
            className="mb-3 text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
          >
            Terms of Service
          </h1>
          <p className="text-on-primary-container/90 text-sm md:text-base">
            Effective Date: September 13, 2026
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-3xl bg-surface-bright border border-outline-variant/80 p-6 md:p-10 rounded-xl space-y-8 text-on-surface-variant text-sm md:text-base leading-relaxed">
          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Zoqelle platform, placing cake orders, or interacting with our services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please refrain from using our service.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              2. Order Acceptance & Customization
            </h2>
            <p>
              All orders are subject to acceptance and ingredient availability. Because each cake is handcrafted by our patissiers, minor artistic variations in floral placement, color shading, or garnishes may occur and celebrate the bespoke nature of our work.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              3. Pricing & Payment Terms
            </h2>
            <p>
              Prices for our items are listed in Philippine Pesos (PHP ₱) inclusive of applicable taxes. Delivery charges are calculated separately during checkout based on delivery location. Full payment is required upon checkout to confirm your order slot.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              4. Delivery & Customer Availability
            </h2>
            <p>
              Customers are responsible for providing an accurate delivery address and contact number. Our couriers will wait a maximum of 15 minutes at the designated address. If no recipient is available, the cake will be returned to our atelier, and redelivery fees will apply.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-on-surface font-semibold mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              5. Intellectual Property
            </h2>
            <p>
              All cake designs, brand imagery, copy, logos, and website assets remain the sole intellectual property of Zoqelle Patisserie.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
