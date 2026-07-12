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
          DEFAULT: '#0c1222',
          raised: '#141c2e',
          overlay: '#1a2332',
          border: '#243044',
        },
        accent: {
          DEFAULT: '#c41e3a',
          hover: '#a81830',
          muted: '#991b1b',
          subtle: 'rgba(196, 30, 58, 0.12)',
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
        card: '0 1px 3px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(36, 48, 68, 0.5)',
        elevated: '0 8px 24px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out forwards',
        'slide-up': 'slide-up 0.25s ease-out forwards',
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
        'sos-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196, 30, 58, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(196, 30, 58, 0)' },
        },
      },
    },
  },
  plugins: [],
}
