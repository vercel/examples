import type { AppProps } from 'next/app'
import Script from 'next/script'
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <Layout
      title="Loading Ads with the Script Component"
      path="solutions/script-component-ad"
      description="Learn how to lazy load ads with the Next.js Script Component"
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
                    '/6355419/Travel/Europe/France/Paris', [300, 250], 'my-banner')
                .addService(googletag.pubads());
            googletag.enableServices();
          });
      `}</Script>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
