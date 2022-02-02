import Head from 'next/head'
import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'

function Home() {
  return (
    <Page>
      <Head>
        <title>-- PLOP TITLE HERE -- - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use -- PLOP TITLE HERE --"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">-- PLOP TITLE HERE -- usage</Text>
        <Text>This example shows how -----------------------</Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">test</Text>
        <Text>
          When using the{' '}
          <Link href="https://nextjs.org/docs/api-reference/next/image#priority">
            <Code>priority</Code>
          </Link>{' '}
          prop the image will be considered high priority and preload. Lazy
          loading is automatically disabled for images using priority.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
