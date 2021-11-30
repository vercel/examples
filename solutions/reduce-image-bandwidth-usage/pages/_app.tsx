import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'

import { getLayout } from '@vercel/edge-functions-ui'

import '@vercel/edge-functions-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Image bandwidth optimization"
      path="reduce-image-bandwidth-usage"
      deployButton={{
        repositoryUrl: 'https://github.com/vercel/examples/tree/main/solutions/reduce-image-bandwidth-usage'
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
