import { sveltekit } from '@sveltejs/kit/vite'
import { vercelToolbar } from '@vercel/toolbar/plugins/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit(), vercelToolbar()],
})
