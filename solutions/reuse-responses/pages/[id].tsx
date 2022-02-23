import type { ParsedUrlQuery } from 'querystring'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Product } from '../types'

import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { Layout, Page, Link } from '@vercel/examples-ui'

import api from '../api'
import ProductCard from '../components/ProductCard'

interface Props {
  product: Product
}

interface Query extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  const products = await api.list()

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    await api.cache.set(products)
  }

  return {
    paths: products.map((product) => ({
      params: {
        id: product.id,
      },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({
  params,
}) => {
  let product = await api.cache.get(params?.id as string)

  if (!product) {
    product = await api.fetch(params?.id as string)
  }

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product,
    },
  }
}

function Home({ product }: Props) {
  return (
    <Page>
      <section className="flex flex-col gap-6 items-center">
        <ProductCard product={product} />
        <Link href="/">Go back to index</Link>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
