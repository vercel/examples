import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'Redirects with fallback',
  description: 'Learn how to use a Next.js route handler for redirects',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="app-directory/css-in-js">{children}</Layout>
      </body>
    </html>
  )
}
