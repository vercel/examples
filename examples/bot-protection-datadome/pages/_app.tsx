import type { AppProps } from 'next/app'
import Script from 'next/script'
import { DATADOME_JS, DATADOME_TAGS } from '@lib/domains'
import '../styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />

      {/* datadome bot protection */}
      <Script>{`
        !function(a,b,c,d,e,f){a.ddjskey=e;a.ddoptions=f||null;var m=b.createElement(c),n=b.getElementsByTagName(c)[0];m.async=1,m.src=d,n.parentNode.insertBefore(m,n)}(window,document,"script","${DATADOME_TAGS}","${process.env.NEXT_PUBLIC_DATADOME_CLIENT_KEY}", {endpoint: '${DATADOME_JS}'});
      `}</Script>
    </main>
  )
}

export default MyApp
