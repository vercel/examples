import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Adding headers at the edge"
      path="edge-functions/add-header"
      description="How to add headers to an incoming request"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
