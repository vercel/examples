module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          100: '#ebeffe',
          500: '#476BF2',
          600: '#335bf1',
          700: '#2e52d9',
        },
      },
    },
  },
  plugins: [],
}
