#!/usr/bin/env node

/**
 * AI Section Design Identification Script
 * 
 * Usage:
 *   node scripts/identify-section-design.js <section-name>
 *   node scripts/identify-section-design.js --all
 *   node scripts/identify-section-design.js --list
 * 
 * Examples:
 *   node scripts/identify-section-design.js hero
 *   node scripts/identify-section-design.js navbar
 *   node scripts/identify-section-design.js productGrid
 */

const fs = require('fs');
const path = require('path');

const SECTION_DESIGNS = {
  navbar: {
    name: 'Header / Navigation Bar',
    sectionKey: 'navbar',
    description: 'Main navigation header containing brand logo, menu links, and cart badge',
    colors: {
      background: '#FFF8F8',
      brand: '#30061A',
      links: '#201A1C',
      activeAccent: '#D4AF37 (Honey Gold)',
      cartBadgeBg: '#D4AF37',
    },
    typography: {
      brandLogo: { family: 'Playfair Display', size: '24px', weight: '700' },
      navLinks: { family: 'Inter', size: '14px', weight: '500' },
    },
    components: {
      cartButton: 'Nightshade pill (#4A1B2F) with Honey Gold badge counter',
    },
  },
  hero: {
    name: 'Hero Section',
    sectionKey: 'hero',
    description: 'Primary landing section introducing Zoqelle luxury patisserie',
    colors: {
      headline: '#30061A (Nightshade)',
      subheadline: '#514347 (Muted Taupe)',
      primaryButtonBg: '#4A1B2F',
      primaryButtonText: '#FFFFFF',
      secondaryLinkColor: '#D4AF37 (Honey Gold)',
      waxSealBadge: '#D4AF37',
    },
    typography: {
      headlineDesktop: { family: 'Playfair Display', size: '64px', weight: '700', letterSpacing: '-0.02em' },
      headlineMobile: { family: 'Playfair Display', size: '36px', weight: '700' },
      subheadline: { family: 'Inter', size: '18px', weight: '400', lineHeight: '1.6' },
      secondaryLink: { family: 'Playfair Display', fontStyle: 'italic', underline: true },
    },
    layout: 'Asymmetric grid with editorial full-bleed imagery and wax seal overlay',
  },
  productGrid: {
    name: 'Product Catalog Grid',
    sectionKey: 'productGrid',
    description: 'Grid layout displaying cakes, pastries, and luxury confectionery',
    colors: {
      sectionBackground: '#FFF8F8',
      cardBackground: '#FFFFFF',
      titleColor: '#201A1C',
      priceColor: '#735C00 / #D4AF37',
      hoverBorder: '#D4AF37',
    },
    typography: {
      title: { family: 'Playfair Display', size: '20px', weight: '500' },
      price: { family: 'Inter', size: '16px', weight: '600' },
      categoryBadge: { family: 'Inter', size: '12px', weight: '600', uppercase: true },
    },
    spacing: { sectionGap: '120px', cardGap: '24px' },
  },
  customizer: {
    name: 'Interactive Cake Customizer',
    sectionKey: 'customizer',
    description: 'Multi-step cake design and customization tool',
    colors: {
      heading: '#30061A',
      selectedCardBg: '#4A1B2F',
      selectedCardText: '#FFFFFF',
      selectedBorder: '#D4AF37',
      unselectedCardBg: '#FFFFFF',
      unselectedBorder: '#D5C2C6',
      stepperLine: '#D4AF37',
    },
    typography: {
      heading: { family: 'Playfair Display', size: '32px', weight: '600' },
      groupTitle: { family: 'Inter', size: '16px', weight: '600' },
    },
  },
  cartDrawer: {
    name: 'Shopping Cart & Drawer',
    sectionKey: 'cartDrawer',
    description: 'Slide-out cart drawer showing order summary and quick checkout button',
    colors: {
      drawerBg: '#FFF8F8',
      itemTitle: '#201A1C',
      itemPrice: '#735C00',
      checkoutBtnBg: '#4A1B2F',
      checkoutBtnText: '#FFFFFF',
    },
    typography: {
      itemTitle: { family: 'Playfair Display', size: '18px', weight: '500' },
      itemPrice: { family: 'Inter', size: '14px', weight: '500' },
    },
  },
  footer: {
    name: 'Footer Section',
    sectionKey: 'footer',
    description: 'Site footer with brand statement, navigation links, and newsletter signup',
    colors: {
      background: '#30061A',
      brandTitle: '#FFFFFF',
      links: '#D5C2C6',
      copyright: '#837377',
      newsletterBorder: '#837377',
      newsletterSubmitBg: '#D4AF37',
    },
    typography: {
      brandTitle: { family: 'Playfair Display', size: '32px', style: 'italic', weight: '600' },
      links: { family: 'Inter', size: '14px', weight: '400' },
      copyright: { family: 'Inter', size: '12px', weight: '400' },
    },
  },
};

function main() {
  const args = process.argv.slice(2);
  const target = args[0] ? args[0].toLowerCase() : '--list';

  if (target === '--list' || target === '-l') {
    console.log('\n🎨 Zoqelle Patisserie - Available Sections:');
    console.log('------------------------------------------------');
    Object.keys(SECTION_DESIGNS).forEach((key) => {
      console.log(` • ${key.padEnd(15)} : ${SECTION_DESIGNS[key].name}`);
    });
    console.log('\nRun: node scripts/identify-section-design.js <section-name>');
    console.log('Example: node scripts/identify-section-design.js hero\n');
    return;
  }

  if (target === '--all' || target === '-a') {
    console.log(JSON.stringify(SECTION_DESIGNS, null, 2));
    return;
  }

  // Normalize camelCase / hyphenated input
  const normalizedKey = Object.keys(SECTION_DESIGNS).find(
    (k) => k.toLowerCase() === target.replace(/[-_]/g, '')
  );

  if (!normalizedKey || !SECTION_DESIGNS[normalizedKey]) {
    console.error(`\n❌ Unknown section: "${args[0]}"`);
    console.log('Available sections:', Object.keys(SECTION_DESIGNS).join(', '));
    process.exit(1);
  }

  const sectionInfo = SECTION_DESIGNS[normalizedKey];
  console.log(`\n================================================`);
  console.log(`✨ Section Design Mappings: ${sectionInfo.name.toUpperCase()}`);
  console.log(`================================================`);
  console.log(JSON.stringify(sectionInfo, null, 2));
  console.log('\n');
}

main();
