import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, defaultChains, InjectedConnector } from 'wagmi'
import { MoralisProvider } from 'react-moralis'

const connectors = () => {
  return [
    new InjectedConnector({
      //@ts-ignore
      defaultChains,
      options: { shimDisconnect: true },
    }),
  ]
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider connectors={connectors} autoConnect>
      <MoralisProvider
        appId={process.env.NEXT_PUBLIC_APP_ID!}
        serverUrl={process.env.NEXT_PUBLIC_SERVER_URL!}
        initializeOnMount
      >
        <Component {...pageProps} />
      </MoralisProvider>
    </Provider>
  )
}

export default MyApp
