import Head from 'next/head'
import { Layout, Text, Page, Link } from '@vercel/examples-ui'
import { ConnectWallet } from '../components/connectWallet'

function Home() {
  return (
    <Page>
      <Head>
        <title>Token Gated Content - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example showing how to use NFT token gated content"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Token Gated Content example</Text>
        <Text>
          This example shows how you can create Token Gated Content using
          Next.js.{' '}
          <Link href="https://github.com/tmm/wagmi" target="_blank">
            Wagmi
          </Link>{' '}
          is used to connect to different wallets and{' '}
          <Link
            href="https://docs.ethers.io/v5/"
            target="
          _blank"
          >
            Ethers
          </Link>{' '}
          is used to interact with the blockchain.
        </Text>
      </section>

      <section className="flex flex-col gap-3 mt-6">
        <ConnectWallet />
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
