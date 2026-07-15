module.exports = {
  presets: [require('@vercel/examples-ui/tailwind')],
  plugins: [require('@tailwindcss/postcss')],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@vercel/examples-ui/**/*.js',
  ],
}
