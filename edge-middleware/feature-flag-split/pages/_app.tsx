import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="AB testing with Split"
      path="edge-middleware/feature-flag-split"
      deployButton={{
        env: [
          'SPLIT_ADMIN_API_KEY',
          'SPLIT_WORKSPACE_ID',
          'SPLIT_ENVIRONMENT_ID',
          'NEXT_PUBLIC_SPLIT_SDK_CLIENT_API_KEY',
        ],
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}
