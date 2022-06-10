import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'
import '../globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Loading web fonts"
      path="solutions/loading-web-fonts"
      description="How to correctly load web fonts"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
