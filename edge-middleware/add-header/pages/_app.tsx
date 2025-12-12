import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="edge-middleware/add-header">
      <Head
        title="Adding response headers at the edge"
        description="How to add response headers in a middleware"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
