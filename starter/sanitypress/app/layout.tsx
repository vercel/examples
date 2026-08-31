import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'SanityPress',
  description: 'SanityPress',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://fav.farm/🖤" />
      </head>
      <body>
        <Layout path="starter/sanitypress">{children}</Layout>
      </body>
    </html>
  )
}
