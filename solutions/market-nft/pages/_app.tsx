import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { WalletContextProvider } from '@mintbase-js/react'
import { mbjs } from '@mintbase-js/sdk'
import { QueryClient, QueryClientProvider } from 'react-query'
import { getLayout } from '@vercel/examples-ui'

import '../styles/globals.css'
import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)
  const queryClient = new QueryClient()

  const network = "testnet" // process.env.NEXT_PUBLIC_NETWORK //|| DEFAULT_NETWORK // TODO: fix this
  mbjs.config({ network: network! }) // TODO: fix this

  return (
    <WalletContextProvider>
      <QueryClientProvider client={queryClient}>
        <Layout
          title="market-nft"
          path="solutions/market-nft"
          description="market-nft"
        >
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </WalletContextProvider>
  )
}

export default App
