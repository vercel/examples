import Head from 'next/head'
import { Layout, Text, Page, Link } from '@vercel/examples-ui'
import { BAYCAbi__factory } from '../types/ethers-contracts'
import { ethers } from 'ethers'
import useSWR from 'swr'
import { FC } from 'react'

// import abi from '../lib/BAYC.abi.json'

// const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'

// const contract = new ethers.Contract(contractAddress, abi)

/**
 *
 * @param param0
 * @returns
 */

const Snippet: FC = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

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
        <Text variant="h1">Fetching data from smart contracts</Text>
        <Text>
          Smart contracts contain relevant information to applications built on
          top of blockchains that can run the{' '}
          <Link href="https://ethereum.org/en/developers/docs/evm/">
            Ethereum Virtual Machine
          </Link>
          . Some of these contracts informations can be exposed in the form of
          View functions that do not need{' '}
          <Link href="https://ethereum.org/en/developers/docs/gas/">
            {' '}
            gas or fees
          </Link>{' '}
          to be executed. Now we will explore how to get that information in
          Next.js
        </Text>

        <Text variant="h2">
          Instanciating a connection to the smart contract
        </Text>
        <Text>
          A first step needed to contact these smart contract via RPC is to
          instanciate a connection to them using a library like{' '}
          <Link href="https://docs.ethers.io/v5/">Ethers.js</Link>.
        </Text>
        <Text>
          The ABI contains information about the available function. Get it from
          Etherscan like explained{' '}
          <Link href="https://cryptomarketpool.com/how-to-get-a-smart-contracts-abi-for-use-in-python-web3-py/">
            Here
          </Link>
          . We will use the Bored Ape Yatch Club popular NFT contract.
        </Text>
        <Snippet>
          {`
import abi from '../lib/BAYC.abi.json'

const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'

const contract = new ethers.Contract(contractAddress, abi)
`}
        </Snippet>
        <Text variant="h2">Fetching the data</Text>

        <Text>
          This can now be used in getServerSideProps or getStaticProps and even
          SWR if you are dealing with a smart contract that is quite active and
          has a lot of usage.
        </Text>
        <Snippet>
          {`// Server side
export async function getServerSideProps() {
  const contractName = await contract.name()
  return {
    props: {
      contractName,
    },
  }
}

// with SWR
const { data } = useSWR('name', () => contract.name())
`}
        </Snippet>
        <Text>Not more complicated than this!</Text>
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
