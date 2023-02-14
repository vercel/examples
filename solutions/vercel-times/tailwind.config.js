module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'content-primary': 'hsla(0,0%,7.06%,1)',
        'content-secondary': 'hsla(0,0%,21.18%,1)',
        'content-tertiary': 'hsla(0,0%,35.3%,1)',
        'content-quaternary': 'hsla(0,0%,44.71%,1)',
        'stroke-quaternary': '#dfdfdf',
      },
      fontSize: {
        '2xs': ['.625rem', '1rem'],
      },
      gridTemplateColumns: {
        14: 'repeat(14, minmax(0, 1fr))',
      },
    },
  },
}
