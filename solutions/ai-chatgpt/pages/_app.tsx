import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="ai-chatgpt"
      path="solutions/ai-chatgpt"
      description="ai-chatgpt"
    >
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  )
}

export default App
