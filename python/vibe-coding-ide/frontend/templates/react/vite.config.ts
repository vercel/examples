// Minimal declaration to avoid requiring @types/node in this template file
declare const process: { env: Record<string, string | undefined> }
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    cors: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    allowedHosts: true,
    proxy: process.env.VITE_API_URL
      ? {
          '/api': {
            target: process.env.VITE_API_URL,
            changeOrigin: true,
            secure: false,
          },
        }
      : undefined,
  },
})
