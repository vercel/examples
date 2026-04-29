'use client'

import type { ReactNode } from 'react'
import { Layout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/message-queue-elasticache">{children}</Layout>
      </body>
    </html>
  )
}
