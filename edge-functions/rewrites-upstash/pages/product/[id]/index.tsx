import type { ParsedUrlQuery } from 'querystring'
import type { GetServerSideProps } from 'next'
import type { Product } from '../../../types'

import { Layout, Page, Link, Button } from '@vercel/examples-ui'

import api from '../../../api'
import ProductCard from '../../../components/ProductCard'
import { useState } from 'react'

interface Props {
  product: Product;
}

interface Query extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({params}) => {
  const product = await api.fetch((params as Query).id)

  if (!product) {
    return {
      notFound: true
    }
  }

  if (!product.stock) {
    return {
      redirect: `/${product.id}/no-stock`,
      props: {
        product
      }
    }
  }

  return {
    props: {
      product
    }
  }
}

function ProductDetails({product}: Props) {
  const [isLoading, toggleLoading] = useState<boolean>(false);

  function handleBuy() {
    toggleLoading(true)

    fetch(`/api/product/${product.id}/stock`, {method: 'DELETE'}).then(() => window.location.reload())
  }

  return (
    <Page>
      <section className="flex flex-col gap-6 items-center">
        <ProductCard product={product} />
        <Button loading={isLoading} onClick={handleBuy}>Buy all stock</Button>
        <Link href="/">Go back to index</Link>
      </section>
    </Page>
  )
}

ProductDetails.Layout = Layout

export default ProductDetails
