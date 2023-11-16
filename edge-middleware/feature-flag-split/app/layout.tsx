import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'feature-flag-split - Vercel Examples',
  description: 'An example showing how to use Vercel with Split.io',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout
          path="edge-middleware/feature-flag-split"
          deployButton={{
            customDeployUrl:
              'https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-split&env=SPLIT_SDK_CLIENT_API_KEY,EDGE_CONFIG,EDGE_CONFIG_SPLIT_ITEM_KEY&project-name=feature-flag-split&repository-name=feature-flag-split&integration-ids=oac_bic40oWF5k9pDFboJhKYqMd1&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%7D%7D',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
