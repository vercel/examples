import type { AppProps } from 'next/app'
import Script from 'next/script'
import { DATADOME_JS, DATADOME_TAGS } from '@lib/domains'
import '../styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />

      {/* datadome bot protection */}

      <Script strategy="lazyOnload">{`
        window.ddjskey = '${process.env.NEXT_PUBLIC_DATADOME_CLIENT_KEY}'
        window.ddoptions = {
          endpoint: '${DATADOME_JS}'
        }
      `}</Script>
      <Script src={DATADOME_TAGS} strategy="lazyOnload" />
    </main>
  )
}

export default MyApp
