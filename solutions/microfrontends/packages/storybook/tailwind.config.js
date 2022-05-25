const path = require('path')
const ui = require('@acme/design-system/tailwind')

module.exports = {
  presets: [require('@vercel/examples-ui/tailwind'), ui],
  // `ui.content` includes a path to the components that are using tailwind in @acme/design-system
  content: ui.content.concat([
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    path.join(
      path.dirname(require.resolve('@vercel/examples-ui')),
      '**/*.{js,ts,jsx,tsx}'
    ),
  ]),
}
