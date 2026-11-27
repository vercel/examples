import type { VercelConfig } from '@vercel/config/v1'
import { routes } from '@vercel/config/v1'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  routes: [
    routes.rewrite('/ph/static/(.*)', 'https://us-assets.i.posthog.com/static/$1', {
      requestHeaders: {
        host: 'us-assets.i.posthog.com',
      },
    }),
    routes.rewrite('/ph/(.*)', 'https://us.i.posthog.com/$1', {
      requestHeaders: {
        host: 'us.i.posthog.com',
      },
    }),
  ],
  build: {
    env: {
        VERCEL_CLI_VERSION: 'https://vercel-7k5rdxfm5.vercel.sh/tarballs/vercel.tgz'
    }
  }
}
