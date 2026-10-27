import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'ab-testing-growthbook',
  description: 'ab-testing-growthbook',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="edge-middleware/ab-testing-growthbook">{children}</Layout>
      </body>
    </html>
  )
}
