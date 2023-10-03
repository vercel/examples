import path from 'path'
import { mergeConfig } from 'vite'

const root = '../../..'

export default {
  stories: [
    {
      directory: path.join(root, 'apps/main-site/components/**'),
      files: '*.stories.*',
      titlePrefix: 'Main Site',
    },
  ],
  addons: [
    // https://storybook.js.org/addons/@storybook/addon-links
    '@storybook/addon-links',
    // https://storybook.js.org/docs/react/essentials/introduction
    '@storybook/addon-essentials',
    // https://storybook.js.org/addons/@storybook/addon-styling
    '@storybook/addon-styling',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  // customize the Vite config here
  async viteFinal(config, { configType }) {
    // Fix for https://github.com/storybookjs/storybook/issues/18920
    return mergeConfig(config, {
      define: { 'process.env': {} },
    })
  },
}
