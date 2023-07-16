const path = require('path')
module.exports = {
  stories: [
    {
      directory: '../../acme-design-system/src/**',
      files: '*.stories.*',
      titlePrefix: 'Design System',
    },
  ],
  addons: [
    // https://storybook.js.org/addons/@storybook/addon-links
    '@storybook/addon-links',
    // https://storybook.js.org/docs/react/essentials/introduction
    '@storybook/addon-essentials',
    '@storybook/addon-styling',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    return config
  },
  docs: {
    autodocs: true,
  },
}
