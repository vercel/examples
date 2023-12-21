/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        accents: {
          0: '#fff',
          1: '#fafafa',
          2: '#eaeaea',
          3: '#999',
          4: '#888',
          5: '#666',
          6: '#444',
          7: '#333',
          8: '#111',
          9: '#000',
        },
      },
    },
  },
}
