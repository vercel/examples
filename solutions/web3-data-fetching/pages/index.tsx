/* eslint-disable react/no-unescaped-entities */
import { Layout, Text, Page, Link, Code } from '@vercel/examples-ui'
import { ethers } from 'ethers'
import { FC } from 'react'
import abi from '../lib/BAYC.abi.json'
import { BORED_APE_YATCH_CLUB_ADDRESS } from '../constants'

const contract = new ethers.Contract(
  BORED_APE_YATCH_CLUB_ADDRESS,
  abi,
  ethers.getDefaultProvider()
)

const Snippet: FC = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

function Home({ contractName }: { contractName: string }) {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Fetching data from smart contracts</Text>
        <Text>
          Smart contracts contain relevant information to applications built on
          top of blockchains that can run the{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://ethereum.org/en/developers/docs/evm/"
          >
            Ethereum Virtual Machine
          </Link>
          . Some of the information in these contracts can be exposed in the
          form of{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://www.tutorialspoint.com/solidity/solidity_view_functions.htm"
          >
            View functions{' '}
          </Link>
          that do not need{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://ethereum.org/en/developers/docs/gas/"
          >
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
          A first step needed to contact these smart contracts via{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://en.wikipedia.org/wiki/Remote_procedure_call"
          >
            RPC
          </Link>{' '}
          is to instanciate a connection with them using a library like{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://docs.ethers.io/v5/"
          >
            Ethers.js
          </Link>
          . There are also convenient libraries like{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://github.com/dethcrypto/TypeChain"
          >
            Typechain
          </Link>{' '}
          to help in this process.
        </Text>
        <Text>
          The{' '}
          <Link
            href="https://www.quicknode.com/guides/solidity/what-is-an-abi"
            target="_blank"
            rel="noreferrer"
          >
            ABI
          </Link>
          {''} contains information about the available function and{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://cryptomarketpool.com/how-to-get-a-smart-contracts-abi-for-use-in-python-web3-py/"
          >
            can be obtained through Etherscan.
          </Link>{' '}
          We will use the Bored Ape Yatch Club popular NFT contract.
        </Text>
        <Snippet>
          {`import abi from '../lib/BAYC.abi.json'

const contractAddress = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'

const contract = new ethers.Contract(contractAddress, abi)
`}
        </Snippet>
        <Text variant="h2">Fetching the data</Text>

        <Text>
          This can now be used in <Code>getStaticProps</Code> or
          <Code>getServerSideProps </Code> to pre-render the contract
          information, or client-side with{' '}
          <Link href="https://swr.vercel.app/" target="_blank" rel="noreferrer">
            SWR
          </Link>
          , which might be better for active contracts with a lot of usage.
        </Text>
        <Snippet>
          {`// Server side
export async function getStaticProps() {
  const contractName = await contract.name()

  return {
    revalidate: 3600,
    props: {
      contractName,
    },
  }
}

// with SWR
const { data } = useSWR('name', () => contract.name())
`}
        </Snippet>
        <Text>
          That's it! Now if we use the <Code>contractName</Code> prop its value
          should be:
        </Text>
        <Snippet>{contractName}</Snippet>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

export async function getStaticProps() {
  const contractName = await contract.name()

  return {
    revalidate: 3600,
    props: {
      contractName,
    },
  }
}
