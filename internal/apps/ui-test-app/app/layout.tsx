import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'Test App',
  description: 'Test app for the @vercel/examples-ui package.',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="internal/apps/ui-test-app">{children as any}</Layout>
      </body>
    </html>
  )
}
