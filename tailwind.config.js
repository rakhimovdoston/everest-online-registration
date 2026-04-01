/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Near-black (exam serious tone)
        primary: {
          DEFAULT: '#1a1a1a',
          light: '#2a2a2a',
        },
        // Accent - Restrained indigo
        accent: {
          DEFAULT: '#4f5b93',
          light: '#6b78a8',
        },
        // Neutral background
        background: {
          DEFAULT: '#fafafa',
          paper: '#ffffff',
        },
        // Border colors
        border: {
          DEFAULT: '#e5e5e5',
          light: '#f0f0f0',
        },
      },
      fontFamily: {
        sans: ['Coolvetica', 'system-ui', 'sans-serif'],
        display: ['Coolvetica', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
      },
      boxShadow: {
        'minimal': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 8px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-up': 'fadeUp 0.8s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
