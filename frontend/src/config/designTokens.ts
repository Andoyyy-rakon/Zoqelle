/**
 * Zoqelle Premium Patisserie - Design System Tokens & Section Mappings
 * Project ID: 15201429199903468545
 */

export const colors = {
  primary: '#30061a',
  primaryContainer: '#4a1b2f',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#c18097',
  secondary: '#735c00',
  secondaryContainer: '#fed65b',
  onSecondary: '#ffffff',
  accentGold: '#D4AF37',
  surface: '#fff8f8',
  surfaceDim: '#e3d7d9',
  surfaceBright: '#fff8f8',
  surfaceContainer: '#f7ebed',
  onSurface: '#201a1c',
  onSurfaceVariant: '#514347',
  background: '#fff8f8',
  onBackground: '#201a1c',
  outline: '#837377',
  outlineVariant: '#d5c2c6',
} as const;

export const typography = {
  displayLg: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '64px',
    fontWeight: '700',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  displayMd: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '48px',
    fontWeight: '600',
    lineHeight: '1.2',
  },
  headlineLg: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '32px',
    fontWeight: '600',
    lineHeight: '1.3',
  },
  headlineSm: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '1.4',
  },
  bodyLg: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '1.6',
  },
  bodyMd: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.6',
  },
  labelCaps: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '1.0',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
} as const;

export const sectionDesigns = {
  navbar: {
    name: 'Header / Navigation Bar',
    background: colors.surface,
    brandFont: typography.headlineSm.fontFamily,
    brandFontSize: '24px',
    brandColor: colors.primary,
    navLinkFont: typography.bodyMd.fontFamily,
    navLinkSize: '14px',
    navLinkColor: colors.onBackground,
    activeAccent: colors.accentGold,
    cartButton: {
      bg: colors.primaryContainer,
      color: colors.onPrimary,
      badgeBg: colors.accentGold,
    },
  },
  hero: {
    name: 'Hero Section',
    headlineFont: typography.displayLg.fontFamily,
    headlineSizeDesktop: typography.displayLg.fontSize,
    headlineSizeMobile: '36px',
    headlineWeight: typography.displayLg.fontWeight,
    headlineColor: colors.primary,
    subheadlineFont: typography.bodyLg.fontFamily,
    subheadlineSize: typography.bodyLg.fontSize,
    subheadlineColor: colors.onSurfaceVariant,
    primaryButton: {
      bg: colors.primaryContainer,
      color: colors.onPrimary,
      radius: '0.25rem',
      fontWeight: '600',
    },
    secondaryButton: {
      color: colors.accentGold,
      underline: true,
      fontStyle: 'italic',
    },
    waxSealBadge: colors.accentGold,
  },
  productGrid: {
    name: 'Product Catalog Grid',
    layoutGap: '120px',
    cardBackground: '#FFFFFF',
    cardBorder: `1px solid ${colors.outlineVariant}`,
    cardHoverBorder: `1px solid ${colors.accentGold}`,
    productTitleFont: typography.headlineSm.fontFamily,
    productTitleSize: typography.headlineSm.fontSize,
    productTitleColor: colors.onSurface,
    priceFont: typography.bodyMd.fontFamily,
    priceSize: '16px',
    priceColor: colors.secondary,
    badgeFont: typography.labelCaps.fontFamily,
    badgeSize: typography.labelCaps.fontSize,
  },
  customizer: {
    name: 'Interactive Cake Customizer',
    headingFont: typography.headlineLg.fontFamily,
    groupTitleFont: typography.bodyMd.fontFamily,
    groupTitleWeight: '600',
    selectedCard: {
      bg: colors.primaryContainer,
      color: colors.onPrimary,
      border: `2px solid ${colors.accentGold}`,
    },
    unselectedCard: {
      bg: '#FFFFFF',
      border: `1px solid ${colors.outlineVariant}`,
    },
    stepperLine: colors.accentGold,
  },
  cartDrawer: {
    name: 'Shopping Cart & Drawer',
    drawerBg: colors.surface,
    itemTitleFont: typography.headlineSm.fontFamily,
    itemTitleSize: '18px',
    itemPriceFont: typography.bodyMd.fontFamily,
    checkoutBtnBg: colors.primaryContainer,
    checkoutBtnColor: colors.onPrimary,
  },
  footer: {
    name: 'Footer Section',
    background: colors.primary,
    brandTitleFont: typography.headlineLg.fontFamily,
    brandTitleStyle: 'italic',
    brandTitleColor: colors.onPrimary,
    linksFont: typography.bodyMd.fontFamily,
    linksColor: colors.outlineVariant,
    newsletterInputBorder: colors.outline,
    newsletterSubmitBtn: colors.accentGold,
    copyrightColor: colors.outline,
  },
} as const;

export default {
  colors,
  typography,
  sectionDesigns,
};
