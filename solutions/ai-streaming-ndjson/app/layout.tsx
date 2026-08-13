import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'AI Streaming with NDJSON',
  description:
    'Progressive token-by-token streaming from a Next.js Route Handler using NDJSON over ReadableStream.',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/ai-streaming-ndjson">{children}</Layout>
      </body>
    </html>
  )
}
