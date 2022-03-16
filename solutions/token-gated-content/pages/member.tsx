import Head from 'next/head'
import Image from 'next/image'
import { Layout, Text, Page, Button, Code } from '@vercel/examples-ui'
import { GetStaticProps } from 'next'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useUserState } from '../hooks/useUser'

interface Product {
  id: string
  title: string
  description: string
  image: string
  price: string
  stock: number
}

interface Props {
  product: Product
}

function ProductCard({ product }: Props) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="ml-14 lg:ml-24 -mb-40 lg:-mb-56">
        <Image
          className="pointer-events-none"
          alt={product.title}
          src={product.image}
          width="440"
          height="440"
          layout="responsive"
        />
      </div>
      <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full hover:shadow-2xl transition pt-16 lg:pt-24">
        <div className="p-4 flex flex-col justify-center items-center border-b">
          <div className="flex justify-between w-full items-baseline">
            <div className="ml-4 mr-auto text-left flex flex-col">
              <h4 className="font-semibold text-xl">{product.title}</h4>
              <h5 className="text-gray-700">{product.description}</h5>
            </div>
            <h4 className="font-bold text-lg">USD {product.price}</h4>
          </div>
        </div>
      </section>
    </div>
  )
}

function Home({ product }: Props) {
  const [_, disconnect] = useAccount()
  useUserState()
  const router = useRouter()
  const handleDisconnect = async () => {
    await disconnect()
    router.push('./')
  }
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
        <Text variant="h1">Token Gated Content Member area</Text>
        <Text>
          Users who are not authenticated and don&apos;t own the NFT will not be
          able to see this exclusive product.
        </Text>
      </section>

      <section className="flex flex-col gap-3 space-y-6">
        <ProductCard product={product} />
        <Text>
          The <Code>useProtected</Code> hook on this page automatically detects
          if metamask is disconnected and redirects users away.
        </Text>
        <Button onClick={handleDisconnect}>Disconnect</Button>
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
        price: 150,
        stock: 5,
      },
    },
  }
}
