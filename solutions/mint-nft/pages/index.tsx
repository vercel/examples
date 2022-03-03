import Head from 'next/head'
import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'
import { Mint } from '../components/Mint'

function Home() {
  return (
    <Page>
      <Head>
        <title>mint-nft - Vercel Example</title>
        <meta name="description" content="Vercel example how to use mint-nft" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">mint-nft usage example</Text>
        <Text>
          This example shows how to connect a Metamask wallet with a Next.js app
          and how to mint NFTs using Moralis, a popular backend service provider
          for Web3 apps.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col ">
        <Mint />
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
