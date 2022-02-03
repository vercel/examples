const path = require('path')
const ui = require('@company/ui/tailwind')

module.exports = {
  presets: [require('@vercel/examples-ui/tailwind'), ui],
  content: ui.purge.concat([
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    path.join(
      path.dirname(require.resolve('@vercel/examples-ui')),
      '**/*.{js,ts,jsx,tsx}'
    ),
  ]),
}
