import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'
import { SessionProvider } from '@/lib/session'

export const metadata = getMetadata({
  title: 'Full-stack app with Neon',
  description:
    'Multi-tenant Next.js app backed entirely by Neon: Postgres, Auth, and the Data API.',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout path="solutions/platforms-blog-neon">
          <SessionProvider>{children}</SessionProvider>
        </Layout>
      </body>
    </html>
  )
}
