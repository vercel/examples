import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'feature-flag-launchdarkly',
  description: 'An example showing how to use Vercel with LaunchDarkly',
})

export const config = { runtime: 'edge' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="edge-middleware/feature-flag-launchdarkly">
          {children}
        </Layout>
      </body>
    </html>
  )
}
