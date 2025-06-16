/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',

  theme: {
    extend: {
      transitionProperty: {
        colors: 'background-color, border-color, color, fill, stroke',
      },
      colors: {
        primary: {
          50: '#F0FBFA',
          100: '#D8F5F5',
          200: '#B6EBEB',
          300: '#84DBDC',
          400: '#4AC2C6',
          500: '#31AFB4',
          600: '#2A8790',
          700: '#286D76',
          800: '#285A62',
          900: '#254C54',
          950: '#143238',
        },
        success: {
          100: '#D1FADF',
          500: '#32D583',
          700: '#12B76A',
        },
        danger: {
          100: '#FFE4E6',
          400: '#fb717b',
          500: '#F04438',
          600: '#e11d2c',
          700: '#B42318',
        },
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
