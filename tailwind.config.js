/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FBF8F4',
          100: '#F5F0EB',
          200: '#EDE5DB',
          300: '#E0D5C5',
          400: '#D2C3AD',
          500: '#C2AF94',
          600: '#A89880',
          700: '#8A7762',
          800: '#6B5A48',
          900: '#4D4032',
        },
        charcoal: {
          DEFAULT: '#1C2321',
          light: '#2A3330',
          muted: '#5A6360',
        },
        signal: '#00A859',
        flare: '#FF6B00',
        crimson: '#D92626',
        cadmium: '#FFC72C',
        teal: {
          DEFAULT: '#0D7C85',
          light: '#14999E',
          dark: '#0A5E64',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(100, 80, 60, 0.08)',
        'glass-hover': '0 16px 48px 0 rgba(100, 80, 60, 0.14)',
        card: '0 4px 24px 0 rgba(100, 80, 60, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
