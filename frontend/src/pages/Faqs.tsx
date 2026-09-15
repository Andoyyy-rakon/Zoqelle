import { useState } from 'react';
import { HelpCircle, ChevronDown, Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqsData: FaqItem[] = [
  {
    category: 'Ordering & Payment',
    question: 'How far in advance should I place my cake order?',
    answer: 'For signature collection cakes, we recommend ordering at least 48 to 72 hours prior to your desired delivery date. For bespoke wedding and multi-tier custom cakes, we suggest booking 2 to 4 weeks in advance.',
  },
  {
    category: 'Ordering & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Credit/Debit cards (Visa, MasterCard), GCash, Maya, Bank Transfer (BDO, BPI), and cash upon pickup at our atelier.',
  },
  {
    category: 'Delivery & Pickup',
    question: 'Where do you deliver?',
    answer: 'We offer hand-delivery across Bacolod City (Downtown, Lacson St., Mandalagan, Eroreco, Mansilingan, Sum-ag, etc.) and surrounding areas (Talisay, Silay, Bago) via climate-controlled courier vehicles.',
  },
  {
    category: 'Delivery & Pickup',
    question: 'Can I pick up my cake directly from your store?',
    answer: 'Yes! You can choose store pickup at our Bacolod City Atelier (123 Patisserie Lane, Lacson St.) during store hours (8:00 AM – 8:00 PM daily). Please present your order confirmation email upon pickup.',
  },
  {
    category: 'Storage & Care',
    question: 'How should I store my cake after receiving it?',
    answer: 'All our mousse and buttercream cakes should be refrigerated (2°C – 5°C) immediately upon arrival. For optimal flavor and texture, remove the cake from the refrigerator 20–30 minutes before serving.',
  },
  {
    category: 'Storage & Care',
    question: 'How long will the cake stay fresh?',
    answer: 'Our cakes are handcrafted without artificial preservatives. When properly refrigerated, they remain fresh and delicious for 3 to 4 days.',
  },
  {
    category: 'Ingredients & Dietary',
    question: 'Do you offer nut-free, eggless, or gluten-free options?',
    answer: 'We offer specific gluten-friendly and eggless options! However, please note that while we practice strict sanitation, all cakes are crafted in an atelier that processes nuts, dairy, and wheat.',
  },
  {
    category: 'Ingredients & Dietary',
    question: 'What kind of ingredients do you use?',
    answer: 'We prioritize premium artisanal ingredients: imported French Grade-A butter, Valrhona dark chocolate, real Madagascar vanilla beans, and fresh local organic eggs.',
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Ordering & Payment', 'Delivery & Pickup', 'Storage & Care', 'Ingredients & Dietary'];

  const filteredFaqs = activeCategory === 'All'
    ? faqsData
    : faqsData.filter((faq) => faq.category === activeCategory);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      
      <section className="relative bg-primary text-on-primary py-16 md:py-20 px-4 md:px-6 text-center">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
            <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
            Frequently Asked Questions
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
          >
            How Can We Help You?
          </h1>
          <p className="text-on-primary-container/90 text-base max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about ordering, delivery, cake care, and dietary options.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0);
                }}
                className={`px-4 py-2 text-xs md:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-bright text-on-surface-variant border border-outline-variant hover:border-primary'
                }`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4 animate-slide-up">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface-bright border border-outline-variant/80 overflow-hidden transition-colors"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                  >
                    <span
                      className="text-base md:text-lg text-on-surface font-medium pr-4"
                      style={{ fontFamily: 'var(--font-family-display)' }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-accent-gold transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 md:px-6 text-on-surface-variant text-sm md:text-base leading-relaxed border-t border-outline-variant/40 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="mt-14 p-8 bg-surface-container border border-outline-variant/80 text-center rounded-xl"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <Star className="h-7 w-7 text-accent-gold mx-auto mb-3" strokeWidth={1.5} />
            <h3
              className="text-xl text-on-surface mb-2"
              style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
            >
              Have a specific question not listed here?
            </h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
              Our patisserie team is happy to answer your custom requests, dietary questions, or delivery inquiries.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-on-primary transition-colors focus-ring"
              style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Our Bakery Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
