/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'matef': '800px',
      }
    },

    colors: {
        dark: '#00203F',
        'dark-100': '#26274F',
        'dark-200': '#393A6C',
        green: '#ADF0D1',
        'green-100': '#3CCF4E',
        'green-200': '#03C988',
        'green-300': '#40586F',
        red: '#FF1F5A',
        black: '#000',
        white: '#fff',
        'dark-green': '#40586F',
      },

  },
  plugins: [
      require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  variants: {
    extend: {
      gridColumn: ['responsive', 'hover', 'focus', 'min'],
    },
  },
}
