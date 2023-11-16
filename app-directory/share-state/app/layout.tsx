import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'Sharing State in Next.js',
  description:
    'Learn to share state in the Next.js app directory so that it can be used anywhere from the layout to its pages.',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="app-directory/share-state">{children}</Layout>
      </body>
    </html>
  )
}
