import type { VercelConfig } from '@vercel/config/v1'

const MINTLIFY_DOCS_URL = process.env.MINTLIFY_DOCS_URL || 'https://vercel-fcadfe60.mintlify.app'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  rewrites: [
    {
      source: '/_mintlify/:path*',
      destination: `${MINTLIFY_DOCS_URL}/_mintlify/:path*`,
    },
    {
      source: '/api/request',
      destination: `${MINTLIFY_DOCS_URL}/_mintlify/api/request`,
    },
    {
      source: '/docs',
      destination: `${MINTLIFY_DOCS_URL}/docs`,
    },
    {
      source: '/docs/llms.txt',
      destination: `${MINTLIFY_DOCS_URL}/llms.txt`,
    },
    {
      source: '/docs/llms-full.txt',
      destination: `${MINTLIFY_DOCS_URL}/llms-full.txt`,
    },
    {
      source: '/docs/sitemap.xml',
      destination: `${MINTLIFY_DOCS_URL}/sitemap.xml`,
    },
    {
      source: '/docs/robots.txt',
      destination: `${MINTLIFY_DOCS_URL}/robots.txt`,
    },
    {
      source: '/docs/mcp',
      destination: `${MINTLIFY_DOCS_URL}/mcp`,
    },
    {
      source: '/docs/:path*',
      destination: `${MINTLIFY_DOCS_URL}/docs/:path*`,
    },
    {
      source: '/mintlify-assets/:path+',
      destination: `${MINTLIFY_DOCS_URL}/mintlify-assets/:path+`,
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

