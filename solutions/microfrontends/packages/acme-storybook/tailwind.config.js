const { getContent } = require('@acme/tailwind-config/content')

module.exports = {
  presets: [require('@acme/tailwind-config')],
  content: getContent(),
}
