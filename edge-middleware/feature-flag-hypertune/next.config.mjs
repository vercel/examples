/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config options here
}

import withVercelToolbar from '@vercel/toolbar/plugins/next'
export default withVercelToolbar()(nextConfig)
