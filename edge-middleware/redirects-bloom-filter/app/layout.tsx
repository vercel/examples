import type { Metadata } from 'next'
import '@vercel/examples-ui/globals.css'
import { Page, Layout } from '@vercel/examples-ui'

export const metadata: Metadata = {
  title: 'Redirect link examples',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Layout path="edge-middleware/redirects-bloom-filter">
          <Page>{children}</Page>
        </Layout>
      </body>
    </html>
  )
}
