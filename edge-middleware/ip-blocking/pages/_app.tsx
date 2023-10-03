import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <SWRConfig
      value={{
        refreshInterval: 40000,
        revalidateOnFocus: false,
        fetcher: (path, init) => fetch(path, init).then((res) => res.json()),
      }}
    >
      <Layout
        title="IP Blocking with Upstash"
        path="edge-middleware/api-rate-limit-and-tokens"
        description="Learn how to do IP blocking at the edge with Upstash."
        deployButton={{
          env: ['UPSTASH_REST_API_DOMAIN', 'UPSTASH_REST_API_TOKEN'],
        }}
      >
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  )
}
