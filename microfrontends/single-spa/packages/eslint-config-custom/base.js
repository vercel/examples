const { resolve } = require('node:path');

module.exports = {
  extends: [
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/typescript',
  ].map((config) => require.resolve(config)),

  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'eslint-comments/require-description': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    camelcase: [
      'error',
      {
        allow: ['^UNSAFE_', '^unstable_', '^experimental_'],
        ignoreDestructuring: false,
        properties: 'never',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'eslint-comments/require-description': 'off',
      },
    },
  ],
};
