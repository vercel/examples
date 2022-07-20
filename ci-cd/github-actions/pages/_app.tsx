import type { AppProps } from 'next/app'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App
