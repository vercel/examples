import type { VercelConfig } from '@vercel/config/v1'

const MINTLIFY_DOCS_URL = process.env.MINTLIFY_DOCS_URL || 'https://mintlify.com/docs'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  rewrites: [
    {
      source: '/docs',
      destination: MINTLIFY_DOCS_URL,
    },
    {
      source: '/docs/:path*',
      destination: `${MINTLIFY_DOCS_URL}/:path*`,
    },
  ],
}

