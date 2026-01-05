'use client'

import { Page, Layout } from '@vercel/examples-ui'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout path="edge-middleware/redirects-bloom-filter">
      <Page>{children}</Page>
    </Layout>
  )
}
