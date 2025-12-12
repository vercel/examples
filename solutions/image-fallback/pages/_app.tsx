import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="solutions/image-fallback">
      <Head
        title="Fallback images from next/image"
        description="How to use a fallback image while using the next/image component"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
