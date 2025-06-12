/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
    darkMode: 'class', // 👈 esto es obligatorio con next-themes

  theme: {
    extend: {
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
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
      },
    },
  },
  plugins: [],
}
