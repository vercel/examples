import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout title="user-agent-based-rendering" path="edge-functions/user-agent-based-rendering">
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
