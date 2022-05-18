import type { AppProps } from 'next/app'
import { WagmiProvider } from 'wagmi'
import { SessionProvider } from 'next-auth/react'

import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <WagmiProvider autoConnect>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Layout
          title="web3-authentication"
          path="solutions/web3-authentication"
          description="Vercel example how to use web3-authentication"
        >
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </WagmiProvider>
  )
}

export default App
