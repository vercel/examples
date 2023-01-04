module.exports = {
  presets: [require('@vercel/examples-ui/tailwind')],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@vercel/examples-ui/**/*.js',
  ],
}
