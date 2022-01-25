module.exports = {
  presets: [
    require('@vercel/examples-ui/tailwind'),
    require('@company/ui/tailwind'),
  ],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/@vercel/examples-ui/**/*.{js,ts,jsx,tsx}',
    'node_modules/@company/ui/**/*.{js,ts,jsx,tsx}',
  ],
  variants: {
    extend: {},
  },
}
