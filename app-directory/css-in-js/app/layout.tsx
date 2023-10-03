import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'CSS-in-JS libraries in the app directory',
  description:
    'Learn how to use CSS-in-JS libraries in the Next.js app directory.',
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
