module.exports = {
  presets: [require('@vercel/edge-functions-ui/tailwind')],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    'node_modules/@vercel/edge-functions-ui/**/*.{js,ts,jsx,tsx}',
    // Include other paths where you use tailwind
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
}
