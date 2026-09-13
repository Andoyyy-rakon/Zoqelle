import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#30061a',
        'primary-container': '#4a1b2f',
        'on-primary': '#ffffff',
        'on-primary-container': '#c18097',
        secondary: '#735c00',
        'secondary-container': '#fed65b',
        'on-secondary': '#ffffff',
        'accent-gold': '#D4AF37',
        surface: '#fff8f8',
        'surface-dim': '#e3d7d9',
        'surface-bright': '#fff8f8',
        'surface-container': '#f7ebed',
        'on-surface': '#201a1c',
        'on-surface-variant': '#514347',
        background: '#fff8f8',
        'on-background': '#201a1c',
        outline: '#837377',
        'outline-variant': '#d5c2c6',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '1.0', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.1)',
        'drawer': '0 -4px 24px rgba(0,0,0,0.08)',
        'modal': '0 12px 40px rgba(0,0,0,0.15)',
      },
      spacing: {
        'section': '120px',
        'section-sm': '80px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-subtle': 'bounceSubtle 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;