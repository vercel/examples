import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { Provider, defaultChains, InjectedConnector } from 'wagmi'
import { MoralisProvider } from 'react-moralis'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

const connectors = () => {
  return [
    new InjectedConnector({
      //@ts-ignore
      defaultChains,
      options: { shimDisconnect: true },
    }),
  ]
}

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout title="mint-nft" path="solutions/mint-nft">
      <Provider connectors={connectors} autoConnect>
        <MoralisProvider
          appId={process.env.NEXT_PUBLIC_APP_ID!}
          serverUrl={process.env.NEXT_PUBLIC_SERVER_URL!}
          initializeOnMount
        >
          <Component {...pageProps} />
        </MoralisProvider>
      </Provider>
    </Layout>
  )
}

export default App
