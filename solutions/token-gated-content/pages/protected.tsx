import Head from 'next/head'

import { Layout } from '@vercel/examples-ui'
import { GetStaticProps } from 'next'
import { Product, ProductCard } from '../components/ProductCard'
import { Info } from '../components/Info'
import { Gradient } from '../components/Gradient'

type Props = {
  product: Product
}

function Home({ product }: Props) {
  return (
    <main className={`sm:px-24 py-6`}>
      <Head>
        <title>Token Gated Content - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example showing how to use NFT token gated content"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Gradient type="dark" />

      <div className="mx-auto px-4  sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-8 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="max-w-2xl mx-auto  lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <Info />
          </div>

          <div className="lg:row-end-1 lg:col-span-4 mt-6 lg:mt-0 h-full flex flex-col ">
            <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
              <ProductCard product={product} blur={false} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

Home.Layout = Layout

export default Home

export const getServerSideProps: GetStaticProps = async () => {
  return {
    props: {
      product: {
        id: 'mug-nextjs',
        title: 'Vercel Mug',
        description: 'Limited Edition',
        image: '/mug.png',
        price: 150,
        stock: 0,
      },
    },
  }
}
