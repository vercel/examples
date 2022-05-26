const path = require('path')

module.exports = {
  // stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.tsx'],
  stories: [
    {
      directory: '../../acme-design-system/src/**',
      files: '*.stories.*',
      // This config is not being used properly by <Story /> in MDX stories
      // If it's not needed to have a prefix, removing it will fix the issue
      titlePrefix: 'Design System',
    },
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  // Faster start times but the initial paint is wrong and a page refresh takes a while.
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    return config
  },
}
