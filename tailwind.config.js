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

      maxWidth: {
        '8xl-mid': '90.5rem', // 1448px
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
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.6s ease-out',
      },
    },
  },

  plugins: [],
}
