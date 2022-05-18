import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="web3-data-fetching"
      path="solutions/web3-data-fetching"
      description="Vercel example how to use data from smart contracts"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
