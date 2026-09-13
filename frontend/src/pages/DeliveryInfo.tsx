import { Truck, ShieldCheck, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DeliveryInfo() {
  const deliveryZones = [
    {
      name: 'Bacolod City Central Zone',
      areas: 'Downtown Bacolod, Lacson Street, Mandalagan, Eroreco, Villamonte, Shopping District',
      fee: '₱100 (Free for orders over ₱1,500)',
      leadTime: 'Same-day (if ordered before 11 AM) or scheduled 24h+',
    },
    {
      name: 'Bacolod City Outer Zone',
      areas: 'Mansilingan, Alijis, Sum-ag, Tangub, Handumanan, Granada, Estefania',
      fee: '₱180 (Free for orders over ₱2,000)',
      leadTime: '24 hours notice',
    },
    {
      name: 'Greater Bacolod Area',
      areas: 'Talisay City, Silay City, Bago City, Murcia',
      fee: 'Calculated at checkout via Grab / Lalamove Car rate',
      leadTime: '24 to 48 hours advance booking required',
    },
  ];

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      {/* Header */}
      <section className="relative bg-primary text-on-primary py-16 md:py-20 px-4 md:px-6 text-center">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
            <Truck className="h-4 w-4" strokeWidth={1.75} />
            Patisserie Shipping & Delivery
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
          >
            Delivered Fresh to Your Doorstep
          </h1>
          <p className="text-on-primary-container/90 text-base max-w-xl mx-auto leading-relaxed">
            We take extreme care to ensure your handcrafted cakes arrive in pristine condition, maintained at optimal serving temperature.
          </p>
        </div>
      </section>

      {/* Main Delivery Info */}
      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Key Guarantee Cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
            <div className="bg-surface-bright p-6 border border-outline-variant/80 rounded-xl">
              <ShieldCheck className="h-8 w-8 text-accent-gold mb-3" strokeWidth={1.5} />
              <h3 className="font-semibold text-on-surface text-lg mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>
                Climate-Controlled Transit
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                All delicate mousse, cream, and tier cakes are transported in refrigerated compartments to prevent melting or structural shift.
              </p>
            </div>

            <div className="bg-surface-bright p-6 border border-outline-variant/80 rounded-xl">
              <Clock className="h-8 w-8 text-accent-gold mb-3" strokeWidth={1.5} />
              <h3 className="font-semibold text-on-surface text-lg mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>
                Flexible Delivery Slots
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Choose morning (9:00 AM – 1:00 PM) or afternoon (2:00 PM – 7:00 PM) delivery windows during checkout.
              </p>
            </div>

            <div className="bg-surface-bright p-6 border border-outline-variant/80 rounded-xl">
              <PackageCheck className="h-8 w-8 text-accent-gold mb-3" strokeWidth={1.5} />
              <h3 className="font-semibold text-on-surface text-lg mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>
                Custom Cake Box Packaging
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Heavy-duty cake bases, anti-slip supports, and elegant gold-trimmed ribbon boxes keep your cake stable.
              </p>
            </div>
          </div>

          {/* Delivery Zones Table */}
          <div className="bg-surface-bright border border-outline-variant/80 rounded-xl p-6 md:p-8 animate-fade-in">
            <h2
              className="text-2xl text-on-surface mb-6"
              style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
            >
              Delivery Zones & Shipping Rates
            </h2>

            <div className="space-y-6">
              {deliveryZones.map((zone, idx) => (
                <div key={idx} className="p-5 bg-surface border border-outline-variant/50 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-medium text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>
                      {zone.name}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary bg-surface-container px-3 py-1 rounded-full w-fit">
                      {zone.fee}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-2">
                    <span className="font-medium text-on-surface">Coverage:</span> {zone.areas}
                  </p>
                  <p className="text-xs text-on-surface-variant/80">
                    <span className="font-medium text-on-surface">Recommended notice:</span> {zone.leadTime}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Self Pickup Notice */}
          <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-gold">
                <MapPin className="h-4 w-4" />
                Prefer Store Pickup?
              </div>
              <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-family-display)' }}>
                Collect Direct From Our Bacolod City Atelier
              </h3>
              <p className="text-on-primary-container/90 text-sm max-w-lg">
                Pickup is free for all orders! Select "Store Pickup" at checkout and pick up at 123 Patisserie Lane, Lacson Street, Bacolod City.
              </p>
            </div>
            <Link
              to="/shop"
              className="px-6 py-3 text-sm font-semibold text-primary transition-colors shrink-0"
              style={{ backgroundColor: 'var(--color-accent-gold)', borderRadius: 'var(--radius-md)' }}
            >
              Order for Pickup
            </Link>
          </div>

          {/* Important Care Instructions */}
          <div className="p-6 bg-surface-container border border-outline-variant/80 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-on-surface font-semibold text-base" style={{ fontFamily: 'var(--font-family-display)' }}>
              <AlertCircle className="h-5 w-5 text-accent-gold" />
              Important Transport & Handling Advice
            </div>
            <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1.5 leading-relaxed pl-1">
              <li>When transporting your cake by personal car, place it flat on the floorboard or trunk space. Never transport on a seat!</li>
              <li>Keep the vehicle air-conditioning turned to cold during transit.</li>
              <li>Refrigerate your cake immediately upon reaching your destination.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
