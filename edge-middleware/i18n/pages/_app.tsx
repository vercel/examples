import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title={pageProps.dictionary?.title || 'i18n'}
      description={pageProps.dictionary?.subtitle}
      path="edge-middleware/i18n"
    >
      <Component {...pageProps} />
    </Layout>
  )
}
