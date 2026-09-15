import { Link } from 'react-router-dom';
import { CakeSlice, Award, Star, Heart, Clock, ArrowRight } from 'lucide-react';
import HeroImage from '../assets/hero.jpeg';
import WeddingImg from '../assets/Wedding_cake_on_cake_stand_202609062136.jpeg';

export default function About() {
  const stats = [
    { label: 'Years of Excellence', value: '10+' },
    { label: 'Cakes Handcrafted', value: '15,000+' },
    { label: 'Master Patissiers', value: '8' },
    { label: 'Customer Satisfaction', value: '99.8%' },
  ];

  const values = [
    {
      icon: Award,
      title: 'Artisanal Mastery',
      description: 'Every recipe is meticulously balanced by master bakers trained in classical French patisserie methods.',
    },
    {
      icon: Star,
      title: 'Uncompromised Ingredients',
      description: 'We source pure Grade A French butter, organic Valrhona cocoa, and fresh seasonal fruits.',
    },
    {
      icon: Heart,
      title: 'Baked with Love',
      description: 'We view every cake as a canvas, crafting unforgettable centerpieces for life’s grandest celebrations.',
    },
    {
      icon: Clock,
      title: 'Fresh Daily Promise',
      description: 'No preservatives or pre-made frozen sponge—each order is baked fresh to order for ultimate flavor.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      
      <section className="relative overflow-hidden bg-primary text-on-primary py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
            <CakeSlice className="h-4 w-4" strokeWidth={1.75} />
            Our Story & Heritage
          </span>
          <h1
            className="mb-6 text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            Crafting Extraordinary Moments, One Cake at a Time
          </h1>
          <p className="text-on-primary-container/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to Zoqelle. Founded with a singular passion for French patisserie technique and contemporary design, we transform fresh ingredients into luxurious edible art.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6 animate-slide-up">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                The Zoqelle Philosophy
              </span>
              <h2
                className="text-3xl md:text-4xl text-on-surface"
                style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
              >
                Where Passion Meets Precision
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                Zoqelle began as a cozy atelier in Bacolod City driven by a simple belief: a cake is never just dessert. It is the highlight of a birthday, the seal of a wedding vow, and the sweet center of family gatherings.
              </p>
              <p className="text-on-surface-variant text-base leading-relaxed">
                From delicate mousse layers to hand-sculpted sugar florals, our master chefs honor time-tested baking traditions while pushing the boundaries of creative cake architecture.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-on-primary transition-colors focus-ring"
                  style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
                >
                  Explore Our Creations
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-4 animate-fade-in">
              <img
                src={HeroImage}
                alt="Zoqelle master baker cake creation"
                className="w-full h-80 object-cover shadow-md"
                style={{ borderRadius: 'var(--radius-lg)' }}
              />
              <img
                src={WeddingImg}
                alt="Artisanal wedding cake detail"
                className="w-full h-80 object-cover shadow-md mt-8"
                style={{ borderRadius: 'var(--radius-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-bright py-14 border-y border-outline-variant/60">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div
                  className="text-3xl md:text-4xl text-primary"
                  style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700 }}
                >
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary block mb-2">
              Our Core Pillars
            </span>
            <h2
              className="text-3xl md:text-4xl text-on-surface"
              style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
            >
              Why Customers Love Zoqelle
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-6 bg-surface-bright border border-outline-variant/70 transition-all hover:border-accent-gold"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <val.icon className="h-8 w-8 text-accent-gold mb-4" strokeWidth={1.5} />
                <h3
                  className="text-lg text-on-surface mb-2"
                  style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
                >
                  {val.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-on-primary py-16 px-4 md:px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2
            className="text-3xl md:text-4xl mb-4 italic"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 500 }}
          >
            Taste the Difference of True Artisanal Patisserie
          </h2>
          <p className="text-on-primary-container/90 mb-8 text-sm md:text-base">
            Browse our signature collections or talk to us about customized celebration cakes today.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-primary focus-ring"
            style={{ backgroundColor: 'var(--color-accent-gold)', borderRadius: 'var(--radius-md)' }}
          >
            Shop All Cakes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
