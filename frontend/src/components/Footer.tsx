import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CakeSlice, Mail, MapPin, Phone, MessageCircle, Globe, Heart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const footerLinks = {
    shop: [
      { label: 'All Cakes', href: '/shop' },
      { label: 'Birthday Cakes', href: '/shop?category=birthday' },
      { label: 'Wedding Cakes', href: '/shop?category=wedding' },
      { label: 'Cupcakes', href: '/shop?category=cupcake' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Delivery Info', href: '/delivery-info' },
    ],
    support: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  };

  const socialLinks = [
    { icon: MessageCircle, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Heart, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Globe, href: 'https://twitter.com', label: 'Twitter' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to Zoqelle updates!');
    setEmail('');
  };

  return (
    <footer className="bg-primary text-on-primary" style={{ fontFamily: 'var(--font-family-body)' }}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <Link to="/" className="inline-flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-family-display)' }}>
              <CakeSlice className="h-6 w-6 text-accent-gold" strokeWidth={1.75} />
              <span className="text-xl font-semibold tracking-tight text-on-primary">Zoqelle</span>
            </Link>
            <p className="mb-7 text-on-primary-container/90 leading-relaxed max-w-xs" style={{ fontSize: '14px', lineHeight: '1.7' }}>
              Handcrafted luxury patisserie. Every cake tells a story of passion, precision, and the finest ingredients.
            </p>
            <div className="flex items-center gap-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-primary-container/80 hover:text-accent-gold transition-colors focus-ring"
                  aria-label={label}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-gold">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-on-primary-container/85 hover:text-on-primary transition-colors focus-ring"
                    style={{ fontSize: '14px' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-gold">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-on-primary-container/85 hover:text-on-primary transition-colors focus-ring"
                    style={{ fontSize: '14px' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-gold">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-on-primary-container/85 hover:text-on-primary transition-colors focus-ring"
                    style={{ fontSize: '14px' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-gold">Newsletter</h3>
            <p className="mb-4 text-on-primary-container/85 text-sm leading-relaxed">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex flex-col gap-2.5" onSubmit={handleSubscribe}>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3.5 py-2.5 bg-on-primary/10 border border-on-primary-container/30 text-on-primary placeholder-on-primary-container/50 text-xs focus:outline-none focus:border-accent-gold transition-all"
                  style={{ borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family-body)' }}
                  aria-label="Email address"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary transition-all hover:brightness-110 active:scale-[0.99] focus-ring"
                style={{ backgroundColor: 'var(--color-accent-gold)', borderRadius: 'var(--radius-md)' }}
              >
                <span>Subscribe</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 border-t border-on-primary-container/25 pt-7">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-on-primary-container/70 mb-5" style={{ fontSize: '12px' }}>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>123 Patisserie Lane, Bacolod City</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>+63 34 123 4567</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>hello@zoqelle.com</span>
            </div>
          </div>

          <p className="text-center text-on-primary-container/60 max-w-2xl mx-auto leading-relaxed my-4" style={{ fontSize: '12.5px' }}>
            Zoqelle is a fictional brand created as a portfolio project. All business information and statistics are for demonstration purposes only.
          </p>

          <p className="text-on-primary-container/70 text-center pt-1" style={{ fontSize: '12px' }}>
            &copy; {currentYear} Zoqelle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}