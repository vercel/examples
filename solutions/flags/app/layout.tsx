import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'flags',
  description: 'flags',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/flags">{children}</Layout>
      </body>
    </html>
  )
}
