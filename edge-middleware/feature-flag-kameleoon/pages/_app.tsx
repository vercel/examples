import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="feature-flag-kameleoon"
      path="feature-flag-kameleoon"
      deployButton={{
        env: ['KAMELEOON_SITE_CODE'],
        repositoryUrl:
          'https://github.com/kameleoon/vercel-examples/tree/main/edge-middleware/feature-flag-kameleoon',
      }}
    >
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
