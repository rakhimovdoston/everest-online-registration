// Brand scales: every indigo-*/blue-* and red-* class across the pages resolves to these
const brandBlue = {
  50: '#E6EEFF',
  100: '#D6E3FF',
  200: '#A9C4FF',
  300: '#7EA6FF',
  400: '#4D83FC',
  500: '#0154F8',
  600: '#0154F8',
  700: '#0046D2',
  800: '#0037A6',
  900: '#002A80',
  950: '#001A52',
};

const brandRed = {
  50: '#FFE6ED',
  100: '#FFE6ED',
  200: '#FFB8CC',
  300: '#FF8AAB',
  400: '#FF4D7E',
  500: '#FE014D',
  600: '#FE014D',
  700: '#DB0042',
  800: '#B80037',
  900: '#8F002B',
  950: '#5C001C',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: brandBlue,
        blue: brandBlue,
        red: brandRed,
        ink: {
          DEFAULT: '#1C2329',
          soft: '#4F565C',
          muted: '#B4BBC1',
        },
        hot: {
          DEFAULT: '#FE014D',
          light: '#FFE6ED',
        },
        line: '#E6E8EB',
        surface: '#F5F6F7',
        control: {
          DEFAULT: '#EBEDF0',
          hover: '#DFE2E6',
        },
        // Primary - Near-black (exam serious tone)
        primary: {
          DEFAULT: '#1C2329',
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
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
