import type { ParsedUrlQuery } from 'querystring'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Product } from '../types'

import { Layout, Page, Link } from '@vercel/examples-ui'

import api from '../api'
import ProductCard from '../components/ProductCard'

interface Props {
  product: Product;
}

interface Query extends ParsedUrlQuery {
  id: string;
}

const cache: Map<string, Product> = new Map();

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  const products = await api.list()

  for (let product of products) {
    cache.set(product.id, product);
  }

  return {
    paths: products.map(product => ({
      params: {
        id: product.id
      },
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({params}) => {
  let product = cache.get(params?.id as string);

  if (!product) {
    product = await api.fetch(params?.id as string)
  }

  if (!product) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      product
    }
  }
}

function Home({product}: Props) {
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
