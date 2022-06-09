const path = require('path')

// Core packages that are using Tailwind CSS
const CORE_PACKAGES = [
  '@vercel/examples-ui',
  '@acme/design-system',
  '@acme/pages',
]

// Include the paths for the components inside packages
function getContent(content, packages) {
  if (!Array.isArray(packages)) {
    packages = CORE_PACKAGES
  }

  return (content || []).concat(
    packages.map((name) => {
      // Every package in this list must have a `/tailwind` config file
      // otherwise this will throw an error, which is expected behavior
      const resolved = require.resolve(path.join(name, 'tailwind'))

      return path.join(path.dirname(resolved), '**/*.{js,ts,jsx,tsx}')
    })
  )
}

module.exports = {
  getContent,
  CORE_PACKAGES,
}
