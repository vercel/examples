const path = require('path')

module.exports = {
  // stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.tsx'],
  stories: [
    {
      // 👇 The directory field sets the directory your stories
      // directory: '../../packages/design-system',
      directory: '../stories',
      // 👇 The titlePrefix field will generate automatic titles for your stories
      titlePrefix: 'DesignSystem',
      // 👇 Storybook will load all files that contain the stories extension
      files: '*.stories.*',
    },
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
}
