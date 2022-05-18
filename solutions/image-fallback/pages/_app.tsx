import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Fallback images from next/image"
      path="solutions/image-fallback"
      description="How to use a fallback image while using the next/image component"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
