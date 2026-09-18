import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  agentRules: false,
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
