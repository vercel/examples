import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="edge-middleware/modify-request-header">
      <Head
        title="Adding request headers in middleware"
        description="How to modify request headers in a middleware"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
