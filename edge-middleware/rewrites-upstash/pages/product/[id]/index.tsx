import type { ParsedUrlQuery } from 'querystring'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Product } from '../../../types'

import { Layout, Page, Link, Button, Text } from '@vercel/examples-ui'

import api from '../../../api'
import ProductCard from '../../../components/ProductCard'
import { useState } from 'react'

interface Props {
  product: Product
}

interface Query extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({
  params,
}) => {
  const product = await api.fetch((params as Query).id)

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    revalidate: 10,
    props: {
      product,
    },
  }
}

export const getStaticPaths: GetStaticPaths<Query> = async () => {
  const products = await api.list()

  return {
    paths: products.map((product) => ({
      params: {
        id: product.id,
      },
    })),
    fallback: 'blocking',
  }
}

function ProductDetails({ product }: Props) {
  const [isLoading, toggleLoading] = useState<boolean>(false)

  function handleBuy() {
    toggleLoading(true)

    fetch(`/api/product/${product.id}/stock`, { method: 'DELETE' }).then(() =>
      window.location.reload()
    )
  }

  return (
    <Page>
      <section className="flex flex-col gap-6 items-center">
        {product.stock ? (
          <>
            <ProductCard product={product} />
            <Button loading={isLoading} onClick={handleBuy}>
              Buy all stock
            </Button>
          </>
        ) : (
          <article className="flex flex-col gap-1 items-center">
            <Text>This product is awesome ({product.title})!</Text>
            <Text>But we ran out of stock 😓</Text>
          </article>
        )}
        <Link href="/">Go back to index</Link>
      </section>
    </Page>
  )
}

ProductDetails.Layout = Layout

export default ProductDetails
