import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Edge Functions and Streams"
      path="edge-functions/streams"
      description="How to use Streams with Edge Functions"
    >
      <Component {...pageProps} />
    </Layout>
  )
}
