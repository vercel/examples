import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="feature-flag-unleash"
      path="edge-middleware/feature-flag-unleash"
      deployButton={{
        env: [
          'UNLEASH_RELAY_SECRET',
          'UNLEASH_SERVER_API_URL',
          'UNLEASH_SERVER_API_TOKEN',
        ],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
