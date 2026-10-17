import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'Native notifications for web apps',
  description:
    'A bridge between your web app and a phone: one HTTP call from a route handler becomes a native notification, and can ask a question back.',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/web-app-native-notifications">{children}</Layout>
      </body>
    </html>
  )
}
