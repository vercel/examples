import Head from 'next/head'
import Image from 'next/image'
import { Layout, Text, Page, Link, Code } from '@vercel/examples-ui'
import Script from 'next/script'
import { AdBanner } from '../components/AdBanner'

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
      </Head>

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
        <Text>
          {' '}
          It allows you to dictave when the script should be loaded using the{' '}
          <Code>strategy</Code> prop. This example uses the{' '}
          <Code>afterInteractive</Code> strategy. While our ads are loading, we
          are reserving a space for them on the page. This allows us to avoid a
          layoutshift.
        </Text>

        <Text>
          This demo introduces a voluntary 3 second lag in loading the ad and
          still receives a perfect lighthouse score.
        </Text>

        <Text className="italic font-bold">
          N.B. having an ad blocker will break this demo
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Add will show below</Text>

        <AdBanner height={250} width={300} />
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
