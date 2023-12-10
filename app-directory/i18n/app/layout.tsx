import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: '`i18n in the app directory',
  description: 'How to do i18n in the Next.js app directory.',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="app-directory/i18n">{children}</Layout>
      </body>
    </html>
  )
}
