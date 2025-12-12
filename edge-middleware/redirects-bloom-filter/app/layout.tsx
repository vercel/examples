import type { Metadata } from 'next'
import '@vercel/examples-ui/globals.css'
import { ClientLayout } from './client-layout'

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
