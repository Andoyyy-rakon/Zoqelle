import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      
      <section className="relative bg-primary text-on-primary py-14 md:py-18 px-4 md:px-6 text-center">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            Customer Satisfaction & Guarantee
          </span>
          <h1
            className="mb-3 text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
          >
            Refund & Cancellation Policy
          </h1>
          <p className="text-on-primary-container/90 text-sm md:text-base">
            Your happiness is our top priority. Learn about our order modifications, cancellations, and replacement terms.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-on-surface-variant text-sm md:text-base leading-relaxed">
          
          <div className="bg-surface-bright border border-outline-variant/80 p-6 md:p-8 rounded-xl space-y-4">
            <h2 className="text-xl text-on-surface font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
              <CheckCircle2 className="h-5 w-5 text-accent-gold" />
              Order Cancellations & Modifications
            </h2>
            <ul className="space-y-3">
              <li className="p-3 bg-surface rounded-lg border border-outline-variant/50">
                <span className="font-semibold text-on-surface">Standard Collection Cakes:</span> Full refund or free date rescheduling if requested at least <strong>48 hours prior</strong> to the scheduled delivery time.
              </li>
              <li className="p-3 bg-surface rounded-lg border border-outline-variant/50">
                <span className="font-semibold text-on-surface">Custom & Wedding Cakes:</span> Cancellations made <strong>7+ days in advance</strong> receive a 100% refund. Cancellations within 3 to 6 days receive a 50% refund due to ingredient prep and artisan scheduling.
              </li>
              <li className="p-3 bg-surface rounded-lg border border-outline-variant/50">
                <span className="font-semibold text-on-surface">Late Cancellations (Under 24 Hours):</span> Orders canceled under 24 hours cannot be refunded as baking and decorating are already completed.
              </li>
            </ul>
          </div>

          <div className="bg-surface-bright border border-outline-variant/80 p-6 md:p-8 rounded-xl space-y-4">
            <h2 className="text-xl text-on-surface font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
              <AlertTriangle className="h-5 w-5 text-accent-gold" />
              Quality Issue or Transit Damage
            </h2>
            <p>
              We take pride in our meticulous quality standards. If your cake arrives damaged or differs significantly from your order specifications:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Take clear photos of the cake and packaging upon delivery.</li>
              <li>Notify our team within <strong>2 hours of delivery</strong> via phone (+63 2 123 4567) or email (hello@zoqelle.com).</li>
              <li>Our team will arrange an immediate replacement cake, atelier credit voucher, or full monetary refund depending on your preference.</li>
            </ol>
          </div>

          <div className="bg-surface-bright border border-outline-variant/80 p-6 md:p-8 rounded-xl space-y-3">
            <h2 className="text-xl text-on-surface font-semibold" style={{ fontFamily: 'var(--font-family-display)' }}>
              Refund Processing Timeline
            </h2>
            <p>
              Approved refunds will be processed back to your original payment method:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>GCash / Maya / E-Wallets:</strong> 1 to 2 business days</li>
              <li><strong>Credit / Debit Cards:</strong> 3 to 7 business days (depending on your issuing bank)</li>
              <li><strong>Bank Transfers:</strong> 1 to 2 business days</li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-on-surface-variant mb-4">Need help with an existing order?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-on-primary focus-ring"
              style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
            >
              Contact Support Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
