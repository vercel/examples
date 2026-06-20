import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without it, Next walks up and finds
  // a stray lockfile (e.g. ~/pnpm-lock.yaml), warns about multiple lockfiles,
  // and may infer the wrong root for output file tracing.
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
