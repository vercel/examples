import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      process.env.POSTGRES_URL ??
      'postgres://localhost:5432/ai_visibility_tracker',
  },
})
