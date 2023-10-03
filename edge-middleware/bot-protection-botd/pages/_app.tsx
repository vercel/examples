import type { AppProps } from 'next/app'
import Botd from '@lib/botd/script'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Botd
      onLoad={() => {
        // You can do a general page check here with Botd. We
        // are skipping this for demo purposes because each
        // page is calling botDetect() and logging the result
        //
        // await botDetect()
      }}
    >
      <Layout
        title="Bot Protection with Botd (by FingerprintJS)"
        path="edge-middleware/bot-protection-botd"
        deployButton={{ env: ['NEXT_PUBLIC_BOTD_API_TOKEN'] }}
      >
        <Component {...pageProps} />
      </Layout>
    </Botd>
  )
}

export default MyApp
