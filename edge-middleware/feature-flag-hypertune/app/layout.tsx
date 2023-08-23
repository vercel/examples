import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'feature-flag-hypertune',
  description: 'An example showing how to use Vercel with Hypertune',
})

export const runtime = 'edge'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="edge-middleware/feature-flag-hypertune">
          {children}
        </Layout>
      </body>
    </html>
  )
}
