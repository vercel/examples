module.exports = {
  presets: [require('@vercel/examples-ui/tailwind')],
  content: [
    // All the packages that might include stories
    './node_modules/@vercel/examples-ui/**/*.js',
  ],
}
