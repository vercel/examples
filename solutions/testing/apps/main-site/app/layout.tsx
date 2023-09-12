import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'Testing Next.js applications',
  description: 'Learn how to test Next.js applications.',
})

// if (process.env.NEXT_PUBLIC_API_MOCKING) {
//   const { initMocks } = require('../mocks/index')
//   initMocks()
// }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/testing">{children}</Layout>
      </body>
    </html>
  )
}
