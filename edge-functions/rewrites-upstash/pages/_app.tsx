import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Rewrite on the edge"
      path="edge-functions/rewrites-upstash"
      description="How to avoid calling several services by pre-checking stock at the edge using a redis cache"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
