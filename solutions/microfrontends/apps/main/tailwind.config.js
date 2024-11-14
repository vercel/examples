module.exports = {
  presets: [
    require('@vercel/examples-ui/tailwind'),
    require('@acme/design-system/tailwind'),
  ],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    // Add the external packages that are using Tailwind CSS
    '../../packages/acme-components/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@acme/design-system/dist/**/*.js',
    './node_modules/@vercel/examples-ui/**/*.js',
  ],
}
