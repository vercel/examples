import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="reusing responses"
      path="solutions/reuse-responses"
      description="How to reduce bandwidth and execution time reusing responses across calls"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
