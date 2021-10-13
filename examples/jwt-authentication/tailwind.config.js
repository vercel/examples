module.exports = {
  presets: [require('@edge-functions/ui/tailwind')],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/@edge-functions/ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
}
