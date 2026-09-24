import { createRequire } from 'module'
import { defineConfig, env } from 'prisma/config'

// Try to load .env into process.env via dotenv. Only relevant for direct
// CLI usage (e.g. `pnpm prisma db push` from a developer's shell). When
// DATABASE_URL is already set in the environment, dotenv is a no-op - and
// we don't want missing dotenv to break the config (e.g. running prisma
// from a freshly-cloned fork without node_modules).
try {
  createRequire(import.meta.url)('dotenv/config')
} catch {
  // dotenv not available - rely on process.env as-is
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
