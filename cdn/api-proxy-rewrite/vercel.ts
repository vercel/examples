import type { VercelConfig } from '@vercel/config/v1'

const EXTERNAL_API_URL =
  process.env.EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  rewrites: [
    {
      source: '/api/external/:path*',
      destination: `${EXTERNAL_API_URL}/:path*`,
    },
  ],
  headers: [
    {
      source: '/api/external/:path*',
      headers: [
        {
          key: 'CDN-Cache-Control',
          value: 'public, max-age=60, stale-while-revalidate=3600',
        },
        {
          key: 'Vercel-Cache-Tag',
          value: 'api',
        },
      ],
    },
  ],
}
