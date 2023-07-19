import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="API Rate Limiting with Vercel KV"
      path="edge-functions/api-rate-limit"
      deployButton={{
        customDeployUrl:
          'https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit?project-name=api-rate-limit&repository-name=api-rate-limit&stores=%5B%7B"type"%3A"kv"%7D%5D',
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
