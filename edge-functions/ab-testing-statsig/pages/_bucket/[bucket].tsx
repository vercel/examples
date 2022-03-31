import Head from 'next/head'
import { Layout, Text, Page, Button } from '@vercel/examples-ui'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'

function BucketPage() {
  const { query: { bucket }, reload } = useRouter();

  function resetBucket() {
    Cookie.remove('uid');

    reload();
  }

  return (
    <Page className="flex flex-col gap-12">
      <Head>
        <title>ab-testing-statsig - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use ab-testing-statsig"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">ab-testing-tatsig usage example</Text>
        <Text>
          This example shows how to Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Voluptas eligendi aliquam officiis aliquid neque
          consequuntur ipsam iste, id, minima sit nulla quidem numquam, vitae
          hic quae sapiente nostrum vel ut.
        </Text>
        <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6">
          bucket: {bucket}
        </pre>
        <Button size="lg" onClick={resetBucket}>Reset bucket</Button>
      </section>
    </Page>
  )
}

BucketPage.Layout = Layout

export default BucketPage
