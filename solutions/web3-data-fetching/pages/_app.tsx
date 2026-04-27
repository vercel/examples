import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="solutions/web3-data-fetching">
      <Head
        title="Web3 Data Fetching"
        description="Learn how to fetch data from smart contracts"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
