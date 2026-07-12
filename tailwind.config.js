/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0b1220',
          raised: '#121c2b',
          overlay: '#182437',
          border: '#2a3950',
        },
        accent: {
          DEFAULT: '#c94552',
          hover: '#ae3542',
          muted: '#8f2634',
          subtle: 'rgba(201, 69, 82, 0.14)',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        slate: {
          950: '#0c1222',
          900: '#141c2e',
          800: '#1a2332',
          700: '#243044',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(1, 7, 20, 0.18), 0 8px 24px rgba(1, 7, 20, 0.12)',
        elevated: '0 18px 44px rgba(1, 7, 20, 0.38)',
      },
      animation: {
        'fade-in': 'fade-in 0.22s ease-out forwards',
        'fade-up': 'fade-up 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-up': 'slide-up 0.24s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shimmer: 'shimmer 1.7s ease-in-out infinite',
        'sos-pulse': 'sos-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'sos-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196, 30, 58, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(196, 30, 58, 0)' },
        },
      },
    },
  },
  plugins: [],
}
