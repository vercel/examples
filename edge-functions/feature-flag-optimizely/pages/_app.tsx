//import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/edge-functions-ui/layout'
import { getLayout } from '@vercel/edge-functions-ui'
import '@vercel/edge-functions-ui/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)
  
  return (
    <Layout
      title="Feature Flagging with Optimizely"
      path="feature-flag-optimizely"
      deployButton={{
        env: ['OPTIMIZELY_SDK_KEY'],
        repositoryUrl: 'https://github.com/optimizely/vercel-examples/tree/zeeshan/optimizely-example/edge-functions'
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
