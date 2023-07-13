import type { AppProps } from 'next/app'
import { Head, getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout(Component)

  return (
    <Layout path="internal/apps/ui-test-app">
      <Head
        title="Test App"
        description="Test app for the @vercel/examples-ui package."
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
