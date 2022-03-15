import Head from 'next/head'
import { Layout, Text, Page, Link } from '@vercel/examples-ui'
import Script from 'next/script'

function Home() {
  return (
    <Page>
      <Head>
        <title>Script Component with ads - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use script-component-ad"
        />
        <link rel="icon" href="/favicon.ico" />
        <Script
          id="Adsense-id"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
      </Head>
      <Script>
        {`
    window.googletag = window.googletag || {cmd: []};
    googletag.cmd.push(function() {
      googletag
          .defineSlot(
              '/6355419/Travel/Europe/France/Paris', [300, 250], 'banner-ad')
          .addService(googletag.pubads());
      googletag.enableServices();
    });
      `}
      </Script>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Script Component with ads example</Text>
        <Text>
          Ads on web pages are typically loaded from script tags. This
          introduces a delay before a page becomes interactive. This is where{' '}
          <Link
            href="https://nextjs.org/docs/api-reference/next/script"
            target="_blank"
          >
            Next/Link
          </Link>{' '}
          comes into play.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Header</Text>

        <div id="banner-ad">
          <Script>
            {`
            googletag.cmd.push(function() {
              googletag.display('banner-ad');
            });
      `}
          </Script>
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
