import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Every page reads the tracker database at request time, so the app runs
  // fully dynamic. Cache Components would only add Suspense plumbing here.
  cacheComponents: false,
  serverExternalPackages: ['@electric-sql/pglite', 'postgres'],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
