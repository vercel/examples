import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="edge-middleware/maintenance-page">
      <Head
        title="Maintenance Page"
        description="Learn how to implement a maintenance page at the edge"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
