import Head from 'next/head'
import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'
import { BAYCAbi__factory } from '../types/ethers-contracts'
import { ethers } from 'ethers'
import useSWR from 'swr'

const contract = BAYCAbi__factory.connect(
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  ethers.providers.getDefaultProvider()
)

function Home({ contractName }: { contractName: string }) {
  const { data } = useSWR('name', () => contract.name())

  return (
    <Page>
      <Head>
        <title>web3-fetching-strategies - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use web3-fetching-strategies"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">web3-fetching-strategies usage example</Text>
        <Text>
          This example shows diffetent ways of fetching data from the
          blockchain. Smart contracts often expose{' '}
          <Link
            className="underline"
            href="https://www.tutorialspoint.com/solidity/solidity_view_functions.htm"
          >
            View functions
          </Link>
          . These functions can be queries without any transaction costs and are
          a convenient way to get current information from a smart contract.
          <br />
          <br />
          Unless they reqire a user to be authenticaed trough his wallet, these
          functions can be called both from the client and the server.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">
          The name {contractName} was fetched serverside. The same name:
          {data} is also fetcheable via SWR in the client.
        </Text>

        <Text>
          Achieving so was done by using the library{' '}
          <Link className="underline" href="https://docs.ethers.io/v5/">
            Ethers.js
          </Link>{' '}
          and passing the informatin of a Smart Contract such as its ABI and the
          smart contract Address. The same could be achieved client side. It
          would be suggested to use the SWR library to validate changed
          information as smart contract view functions normally indicate the
          current state of a smart contract.
          <br />
          <br />
          The same strategy of using SWR should be used when dealing with
          information that required the user to be authenticated using a wallet
          such as Metamask as this Data becomes only available Client Side.
          Passing your ethers.js contract instance as the fetcher to SWR works
          well.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

export async function getServerSideProps() {
  const contractName = await contract.name()
  return {
    props: {
      contractName,
    },
  }
}
