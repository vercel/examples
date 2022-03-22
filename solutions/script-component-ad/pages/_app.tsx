import type { AppProps } from 'next/app'
import type { LayoutProps } from '@vercel/examples-ui/layout'

import { getLayout } from '@vercel/examples-ui'

import '@vercel/examples-ui/globals.css'
import Script from 'next/script'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Script Component with ads"
      path="solutions/script-component-ad"
    >
      <Script
        strategy="lazyOnload"
        id="script-component-ad"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      />

      <Script id="define-slot" strategy="lazyOnload">{`
          window.googletag = window.googletag || {cmd: []};
          googletag.cmd.push(function() {
            googletag
                .defineSlot(
                    '/6355419/Travel/Europe/France/Paris', [300, 250], 'banner-ad')
                .addService(googletag.pubads());
            googletag.enableServices();
          });
      `}</Script>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
