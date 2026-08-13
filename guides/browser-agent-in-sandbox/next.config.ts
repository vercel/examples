import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The agent route provisions a Vercel Sandbox and runs a multi-step agent
  // loop, which can take a few minutes. `@vercel/sandbox` must run on the
  // Node.js runtime (not Edge).
  serverExternalPackages: ['@vercel/sandbox', 'bash-tool', 'just-bash'],
  // This example ships its own lockfile inside the vercel/examples monorepo;
  // pin the workspace root here so Next doesn't infer the parent.
  turbopack: { root: import.meta.dirname },
}

export default nextConfig
