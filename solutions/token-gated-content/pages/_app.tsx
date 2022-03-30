import type { AppProps } from 'next/app'
import { defaultChains, WagmiProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

const connector = new InjectedConnector({
  chains: [...defaultChains],
})

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)
  return (
    <Layout title="token-gated-content" path="solutions/token-gated-content">
      <WagmiProvider autoConnect connectors={[connector]}>
        <Component {...pageProps} />
      </WagmiProvider>
    </Layout>
  )
}

export default App
