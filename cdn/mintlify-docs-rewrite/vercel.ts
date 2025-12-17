import type { VercelConfig } from '@vercel/config/v1'

const MINTLIFY_DOCS_URL = process.env.MINTLIFY_DOCS_URL || 'https://vercel-fcadfe60.mintlify.dev'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  rewrites: [
    {
      source: '/docs',
      destination: `${MINTLIFY_DOCS_URL}/docs`,
    },
    {
      source: '/docs/:match*',
      destination: `${MINTLIFY_DOCS_URL}/docs/:match*`,
    },
  ],
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' d4tuoctqmanu0.cloudfront.net fonts.googleapis.com; font-src 'self' d4tuoctqmanu0.cloudfront.net fonts.googleapis.com; img-src 'self' data: blob: d3gk2c5xim1je2.cloudfront.net mintcdn.com *.mintcdn.com cdn.jsdelivr.net; connect-src 'self' *.mintlify.dev *.mintlify.com d1ctpt7j8wusba.cloudfront.net mintcdn.com *.mintcdn.com api.mintlifytrieve.com; frame-src 'self' *.mintlify.dev;",
        },
      ],
    },
  ],
}

