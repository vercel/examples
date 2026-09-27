import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
])

export default eslintConfig
