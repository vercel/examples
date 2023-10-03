import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Image bandwidth optimization"
      path="solutions/reduce-image-bandwidth-usage"
      description="Learn how to reduce next/image bandwidth"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
