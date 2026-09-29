import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'
import './globals.css'

export const metadata = getMetadata({
  title: 'Tarot Reading Starter',
  description:
    'Build random tarot draws, three-card spreads, and a card lookup API with Next.js 16.',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="starter/tarot-reading">{children}</Layout>
      </body>
    </html>
  )
}
