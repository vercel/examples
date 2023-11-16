import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: '-- PLOP TITLE HERE --',
  description: '-- PLOP TITLE HERE --',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="-- PLOP PATH HERE --">{children}</Layout>
      </body>
    </html>
  )
}
