import type { VercelConfig } from '@vercel/config/v1'

const config: VercelConfig = {
  buildCommand: 'pnpm turbo build',
  ignoreCommand: 'pnpm dlx turbo-ignore',
}

export default config
