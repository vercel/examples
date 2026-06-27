import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="solutions/reduce-image-bandwidth-usage">
      <Head
        title="Image bandwidth optimization"
        description="Learn how to reduce next/image bandwidth"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
