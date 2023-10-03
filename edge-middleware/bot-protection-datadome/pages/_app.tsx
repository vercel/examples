import type { AppProps } from 'next/app'
import Script from 'next/script'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import { DATADOME_JS, DATADOME_TAGS } from '@lib/constants'
import '@vercel/examples-ui/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Bot Protection with DataDome"
      path="edge-middleware/bot-protection-datadome"
      deployButton={{
        env: ['NEXT_PUBLIC_DATADOME_CLIENT_KEY', 'DATADOME_SERVER_KEY'],
      }}
    >
      <Component {...pageProps} />

      {/* datadome bot protection */}
      <Script strategy="lazyOnload" id="load-datadome">{`
        window.ddjskey = '${process.env.NEXT_PUBLIC_DATADOME_CLIENT_KEY}'
        window.ddoptions = {
          endpoint: '${DATADOME_JS}'
        }
      `}</Script>
      <Script src={DATADOME_TAGS} strategy="lazyOnload" />
    </Layout>
  )
}

export default MyApp
