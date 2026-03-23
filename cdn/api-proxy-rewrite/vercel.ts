import { routes, type VercelConfig } from '@vercel/config/v1'

const EXTERNAL_API_URL =
  process.env.EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  rewrites: [
    routes.rewrite(
      '/api/external/:path*',
      `${EXTERNAL_API_URL}/:path*`,
    ),
  ],
  headers: [
    routes.header('/api/external/:path*', [
      {
        key: 'CDN-Cache-Control',
        value: 'public, max-age=60, stale-while-revalidate=3600',
      },
      {
        key: 'Vercel-Cache-Tag',
        value: 'api',
      },
    ]),
  ],
}
