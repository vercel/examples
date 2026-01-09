import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'aws-neptune-analytics',
  description: 'aws-neptune-analytics',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/aws-neptune-analytics">{children}</Layout>
      </body>
    </html>
  )
}
