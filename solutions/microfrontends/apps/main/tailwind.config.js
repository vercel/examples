const { getContent, CORE_PACKAGES } = require('@acme/tailwind-config/content')

module.exports = {
  presets: [require('@acme/tailwind-config')],
  content: getContent(
    ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    [...CORE_PACKAGES, '@acme/pages']
  ),
}
