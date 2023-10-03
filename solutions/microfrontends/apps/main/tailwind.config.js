module.exports = {
  presets: [
    require('@vercel/examples-ui/tailwind'),
    require('@acme/design-system/tailwind'),
  ],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Add the external packages that are using Tailwind CSS
    './node_modules/@vercel/examples-ui/**/*.js',
    './node_modules/@acme/design-system/**/*.js',
    './node_modules/@acme/pages/**/*.js',
  ],
}
