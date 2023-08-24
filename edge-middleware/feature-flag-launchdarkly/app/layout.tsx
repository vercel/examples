import type { ReactNode } from 'react'
import { Layout, getMetadata } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export const metadata = getMetadata({
  title: 'feature-flag-launchdarkly',
  description: 'An example showing how to use Vercel with LaunchDarkly',
})
export const runtime = 'edge'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout
          path="edge-middleware/feature-flag-launchdarkly"
          deployButton={{
            customDeployUrl:
              'https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-middleware/feature-flag-launchdarkly&project-name=feature-flag-launchdarkly&repository-name=feature-flag-launchdarkly&integration-ids=oac_8DFUMlauSkqeQhdGHpL5xbWp&env=NEXT_PUBLIC_LD_CLIENT_SIDE_ID&env=EDGE_CONFIG&edge-config-stores=%7B%22EDGE_CONFIG%22%3A%7B%7D%7D',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
