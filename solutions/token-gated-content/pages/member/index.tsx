import Head from 'next/head'
import Image from 'next/image'
import {
  Layout,
  Text,
  Page,
  Button,
  Code,
  LoadingDots,
} from '@vercel/examples-ui'
import { GetStaticProps } from 'next'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useUserState } from '../../hooks/useUser'
import { ProductCard, Product } from '../../components/ProductCard'

type Props = {
  product: Product
}

function Home({ product }: Props) {
  const { handleConnect, loading } = useUserState()

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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6  lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          <span className="block">Connect your wallet</span>
          <span className="block text-blue-600">For exclusive merchandise</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button
              onClick={handleConnect}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? <LoadingDots /> : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-3 space-y-6">
        <ProductCard product={product} blur />
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      product: {
        id: 'mug-nextjs',
        title: 'Vercel Mug',
        description: 'Limited Edition',
        image: '/mug.png',
        price: 0.0,
        stock: 0,
      },
    },
  }
}
