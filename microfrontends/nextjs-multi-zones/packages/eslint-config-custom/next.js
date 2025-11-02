const { resolve } = require('node:path');

module.exports = {
  extends: [
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/react',
    '@vercel/style-guide/eslint/next',
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/jest',
  ].map((config) => require.resolve(config)),

  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'eslint-comments/require-description': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
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
    {
      files: [
        'pages/**',
        'src/pages/**',
        'next.config.*',
        '**/theme.config.tsx',
        'app/**/{head,layout,loading,page,error,global-error,not-found}.tsx',
        'src/app/**/{head,layout,page,}.tsx',
      ],
      rules: {
        // This isn't supported in Next.js today.
        // https://github.com/vercel/next.js/discussions/35725
        'import/no-default-export': 'off',
      },
    },
  ],
};
