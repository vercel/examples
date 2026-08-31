import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import { abby } from '@lib/abby'
import '@vercel/examples-ui/globals.css'
import { ABBY_DATA_KEY } from '@tryabby/next'

function MyApp({
  Component,
  pageProps: { [ABBY_DATA_KEY]: abbyData, ...pageProps },
}: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <abby.AbbyProvider initialData={abbyData}>
      <Layout
        title="AB Testing with A/BBY"
        path="edge-middleware/abby-ab-testing"
      >
        <Component {...pageProps} />
      </Layout>
    </abby.AbbyProvider>
  )
}

export default abby.withAbby(MyApp)
