import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Feature Flagging with Optimizely"
      path="feature-flag-optimizely"
      deployButton={{
        env: ['OPTIMIZELY_SDK_KEY'],
        repositoryUrl:
          'https://github.com/optimizely/vercel-examples/tree/main/edge-middleware/feature-flag-optimizely',
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
