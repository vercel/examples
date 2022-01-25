const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
  },

  plugins: [],
}
