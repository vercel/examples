import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import {
  configureChains,
  createClient,
  WagmiConfig,
  goerli
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from "next-auth/react"
import '@vercel/examples-ui/globals.css'

const { provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()],
);

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <SessionProvider session={session}>
      <Layout
        title="mint-nft"
        path="solutions/mint-nft"
        description="How to mint an NFT"
      >
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      </Layout>
    </SessionProvider>
  )
}

export default App
