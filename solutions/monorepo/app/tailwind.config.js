module.exports = {
  presets: [
    require('@vercel/edge-functions-ui/tailwind'),
    require('@company/ui'),
  ],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/@vercel/edge-functions-ui/**/*.{js,ts,jsx,tsx}',
    'node_modules/@company/ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
}
