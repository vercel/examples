import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'
import { withEve } from 'eve/next'

const nextConfig: NextConfig = {
  agentRules: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.md/,
      type: 'asset/source',
    })
    return config
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.com',
        port: '',
        pathname: '/api/www/avatar/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default withEve(withBotId(nextConfig))
