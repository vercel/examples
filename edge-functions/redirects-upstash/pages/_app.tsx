import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'
import { getLayout } from '@vercel/edge-functions-ui'
import '@vercel/edge-functions-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Edge Redirects"
      path="redirects-upstash"
      deployButton={{
        env: [
          'UPSTASH_REST_API_DOMAIN',
          'UPSTASH_REST_API_TOKEN',
          'UPSTASH_EDGE_API_DOMAIN',
          'UPSTASH_EDGE_API_TOKEN',
        ],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
