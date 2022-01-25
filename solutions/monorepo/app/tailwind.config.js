const ui = require('@company/ui/tailwind')

module.exports = {
  presets: [require('@vercel/examples-ui/tailwind'), ui],
  purge: ui.purge.concat([
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/@vercel/examples-ui/**/*.{js,ts,jsx,tsx}',
  ]),
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
}
