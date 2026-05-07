/** @type {import('next').NextConfig} */
/**
 * Next.js 13+ suppports two runtimes: Edge and Node.js
 * valkey-glide is a native Node.js addon with compiled bunary files (.node extensions)
 * that interface directly with system-level code. The Edge Runtime cannot execute them.
 *
 * We are excluding valkey-glide from webpack's build since there will be an external package
 * available at runtime from `node_modules`.
 */
const nextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['@valkey/valkey-glide'],
}

module.exports = nextConfig
