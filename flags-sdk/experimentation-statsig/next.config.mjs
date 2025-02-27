// eslint-disable-next-line import/no-unresolved -- unsure
import withVercelToolbar from '@vercel/toolbar/plugins/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nodeMiddleware: true,
  },
};

export default withVercelToolbar()(nextConfig);
