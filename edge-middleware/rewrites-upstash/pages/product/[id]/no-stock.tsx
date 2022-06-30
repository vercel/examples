import type { ParsedUrlQuery } from 'querystring'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Product } from '../../../types'

import { Layout, Page, Link, Text, Button } from '@vercel/examples-ui'

import api from '../../../api'
import { useState } from 'react'

interface Props {
  product: Product
}

interface Query extends ParsedUrlQuery {
  id: string
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

export const getStaticProps: GetStaticProps<Props, Query> = async ({
  params,
}) => {
  const product = await api.fetch(params?.id as string)

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

function NoStock({ product }: Props) {
  const [isLoading, toggleLoading] = useState<boolean>(false)

  function handleAddStock() {
    toggleLoading(true)

    fetch(`/api/product/${product.id}/stock`, { method: 'POST' }).then(() =>
      window.location.reload()
    )
  }

  return (
    <Page>
      <section className="flex flex-col gap-6 items-center">
        <article className="flex flex-col gap-1 items-center">
          <Text>This product is awesome ({product.title})!</Text>
          <Text>But we ran out of stock 😓</Text>
        </article>
        <Button loading={isLoading} onClick={handleAddStock}>
          Add some stock
        </Button>
        <Link href="/">Go back to index</Link>
      </section>
    </Page>
  )
}

NoStock.Layout = Layout

export default NoStock
