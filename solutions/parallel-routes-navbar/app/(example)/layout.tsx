import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'parallel-routes-navbar',
  description: 'parallel-routes-navbar',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/parallel-routes-navbar">{children}</Layout>
      </body>
    </html>
  )
}
