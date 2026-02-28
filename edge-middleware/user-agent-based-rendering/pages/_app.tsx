import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="edge-middleware/user-agent-based-rendering">
      <Head
        title="User-Agent Based Rendering"
        description="Learn to use the User-Agent header to render different pages"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
