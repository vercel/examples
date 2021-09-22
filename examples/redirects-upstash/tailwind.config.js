const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#FFF86C',
        secondary: '#181F8E',
        anchor: '#8FFFFD',
        code: '#A2FF70',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
