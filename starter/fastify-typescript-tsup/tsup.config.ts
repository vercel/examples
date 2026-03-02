import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/serverless.ts'],
  format: ['esm'],
  clean: true,
  target: 'esnext',
  tsconfig: 'tsconfig.json',
})
