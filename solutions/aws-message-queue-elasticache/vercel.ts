import { defineConfig } from '@vercel/config'

export default defineConfig({
  buildCommand: 'pnpm turbo build',
  ignoreCommand: 'pnpm dlx turbo-ignore',
})
