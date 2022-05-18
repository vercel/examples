import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Combining data fetching strategies"
      path="solutions/combining-data-fetching-strategies"
      description="How to adapt data fetching to avoid moving from static pre-rendering"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
