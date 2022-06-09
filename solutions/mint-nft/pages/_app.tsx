import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { MoralisProvider } from 'react-moralis'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="mint-nft"
      path="solutions/mint-nft"
      description="How to mint an NFT"
    >
      <MoralisProvider
        appId={process.env.NEXT_PUBLIC_APP_ID!}
        serverUrl={process.env.NEXT_PUBLIC_SERVER_URL!}
        initializeOnMount
      >
        <Component {...pageProps} />
      </MoralisProvider>
    </Layout>
  )
}

export default App
