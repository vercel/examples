import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Edge Redirects"
      path="edge-middleware/redirects-upstash"
      deployButton={{
        env: [
          'KV_REST_API_URL',
          'KV_REST_API_TOKEN',
          'KV_REST_API_READ_ONLY_TOKEN',
        ],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
