import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import '@vercel/examples-ui/globals.css'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="mint-nft"
      path="solutions/mint-nft"
      description="How to mint an NFT"
    >
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </Layout>
  )
}

export default App
