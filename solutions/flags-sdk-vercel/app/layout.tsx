import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import { VercelToolbar } from '@vercel/toolbar/next'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'Flags SDK with Vercel',
  description: 'An example showing how to use the Flags SDK with Vercel Flags.',
})

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/flags-sdk-vercel">
          {children}
          <VercelToolbar />
        </Layout>
      </body>
    </html>
  )
}
