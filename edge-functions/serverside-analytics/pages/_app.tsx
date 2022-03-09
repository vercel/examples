import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'
import snippet from '@segment/snippet'

import '@vercel/examples-ui/globals.css'
import { useEffect } from 'react'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  useEffect(() => {})
  return (
    <Layout
      title="Serverside Analytics"
      path="edge-functions/serverside-analytics"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
