import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import '@vercel/examples-ui/globals.css'
import '../styles/globals.css'

import { getLayout } from '@vercel/examples-ui'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Content Stack Commerce Demo"
      path="solutions/cms-contentstack-commerce"
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
