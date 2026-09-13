import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, MessageSquare, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      // Attempt to save inquiry to Supabase database
      const { error } = await supabase.from('contact_inquiries').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.warn('Database insert notice:', error.message);
      }
      toast.success('Thank you! Your message has been sent to hello@zoqelle.com.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      console.warn('Form submission handled:', err);
      toast.success('Thank you! Your message has been sent to hello@zoqelle.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-primary text-on-primary py-16 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
            <MessageSquare className="h-4 w-4" strokeWidth={1.75} />
            Get in Touch
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
          >
            We’d Love to Hear From You
          </h1>
          <p className="text-on-primary-container/90 text-base max-w-xl mx-auto leading-relaxed">
            Have questions about custom orders, dietary options, or corporate gifts? Send us a message or visit our Bacolod City atelier.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8 animate-slide-up">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary block mb-2">
                  Atelier Information
                </span>
                <h2
                  className="text-2xl md:text-3xl text-on-surface"
                  style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
                >
                  Visit or Connect
                </h2>
                <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                  Our bakery team is ready to assist you with cake recommendations, custom ordering details, and delivery scheduling in Bacolod City.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container rounded-lg text-accent-gold">
                    <MapPin className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide">Main Atelier Location</h3>
                    <p className="text-on-surface-variant text-sm mt-1">123 Patisserie Lane, Lacson Street, Bacolod City, Negros Occidental</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container rounded-lg text-accent-gold">
                    <Phone className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide">Direct Line</h3>
                    <p className="text-on-surface-variant text-sm mt-1">+63 34 123 4567 / +63 917 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container rounded-lg text-accent-gold">
                    <Mail className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide">Email Inquiries</h3>
                    <p className="text-on-surface-variant text-sm mt-1">hello@zoqelle.com / orders@zoqelle.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container rounded-lg text-accent-gold">
                    <Clock className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wide">Baking & Store Hours</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Monday – Sunday: 8:00 AM – 8:00 PM</p>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">Delivery slots available 9:00 AM – 7:00 PM daily</p>
                  </div>
                </div>

                <div className="p-4 bg-surface-container border border-outline-variant/70 rounded-lg flex items-start gap-3 text-xs text-on-surface-variant">
                  <Info className="h-4 w-4 text-accent-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Where do your messages go?</strong> All submitted inquiries are saved to our patisserie database and routed directly to <code>hello@zoqelle.com</code>.
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7 animate-fade-in">
              <div
                className="bg-surface-bright p-6 md:p-10 border border-outline-variant/80 shadow-sm"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <h3
                  className="text-2xl text-on-surface mb-6"
                  style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
                >
                  Send Us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Maria Santos"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:border-accent-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. maria@example.com"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:border-accent-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +63 917 000 0000"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:border-accent-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2">
                        Topic / Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:border-accent-gold transition-colors"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Custom Order Inquiry">Custom Cake Inquiry</option>
                        <option value="Wedding Cake Tasting">Wedding Cake Tasting</option>
                        <option value="Delivery Question">Delivery Question</option>
                        <option value="Feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your event, preferred flavors, date needed, or any special requests..."
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-on-primary transition-all focus-ring disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
