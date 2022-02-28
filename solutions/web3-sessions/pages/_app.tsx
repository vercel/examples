import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Provider as WagmiProvider } from 'wagmi'

import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <WagmiProvider autoConnect>
      <SessionProvider session={pageProps.session}>
        <Layout title="web3-sessions" path="solutions/web3-sessions">
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </WagmiProvider>
  )
}

export default App
