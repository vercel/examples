const path = require('path')

module.exports = {
  stories: [
    {
      directory: '../../acme-design-system/src/**',
      files: '*.stories.*',
      // This config is not being used properly by <Story /> in MDX stories.
      // If it's not needed to have a prefix, removing it will fix the issue
      titlePrefix: 'Design System',
    },
  ],
  addons: [
    // https://storybook.js.org/addons/@storybook/addon-links
    '@storybook/addon-links',
    // https://storybook.js.org/docs/react/essentials/introduction
    '@storybook/addon-essentials',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true, // build stories on demand
  },
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    return config
  },
}
