import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout, Head } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout path="solutions/on-demand-isr">
      <Head title="On demand ISR" description="Learn to use on demand ISR" />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
