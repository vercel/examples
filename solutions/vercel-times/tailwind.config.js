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
        '4xs': [
          '.60rem',
          {
            lineHeight: '.75rem',
          },
        ],
        '3xs': [
          '.65rem',
          {
            lineHeight: '.75rem',
          },
        ],
        '2xs': [
          '.70rem',
          {
            lineHeight: '.75rem',
          },
        ],
      },
      screens: {
        '8xl': '1921px',
      },
      maxWidth: {
        '8xl': '1921px',
      },
      gridTemplateColumns: {
        14: 'repeat(14, minmax(0, 1fr))',
      },
    },
  },
};
