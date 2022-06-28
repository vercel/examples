import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="API Rate Limiting with Upstash"
      path="edge-functions/api-rate-limit"
      deployButton={{
        env: ['UPSTASH_REST_API_DOMAIN', 'UPSTASH_REST_API_TOKEN'],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
