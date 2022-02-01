module.exports = {
  mode: 'jit',
  presets: [require('@vercel/examples-ui/tailwind')],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/@vercel/examples-ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
}
