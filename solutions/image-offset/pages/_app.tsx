import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="solutions/image-offset">
      <Head
        title="next/image offset loading"
        description="Understanding next/image offset loading"
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
