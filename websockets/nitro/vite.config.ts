import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // Nitro v3 powers the server. `features.websocket` enables native crossws
    // support, which works the same in local dev and on Vercel — the Vercel
    // preset bridges the runtime socket upgrade through `crossws/adapters/vercel`,
    // so a single `defineWebSocketHandler` handles every environment.
    nitro({
      serverDir: './server',
      features: {
        websocket: true,
      },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
})
