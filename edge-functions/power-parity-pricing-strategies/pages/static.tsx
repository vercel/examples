import type { GetStaticProps } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { Layout } from '@vercel/examples-ui'

import api from '../api'
import { Product } from '../types'

interface Props {
  product: Product
}

export const getStaticProps: GetStaticProps<unknown, never> = async () => {
  // Get product
  const product = await api.product.fetch()

  return {
    props: {
      product,
    },
  }
}

function StaticProductPage({ product }: Props) {
  return (
    <>
      <div className="ml-14 lg:ml-24 -mb-40 lg:-mb-56">
        <Image
          className="pointer-events-none"
          alt={product.name}
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
              <h4 className="font-semibold text-xl">{product.name}</h4>
              <h5 className="text-gray-700">{product.description}</h5>
            </div>
            <h4 className="font-bold text-lg">USD {product.price}</h4>
          </div>
        </div>
        <div className="p-4 gap-4 flex flex-col justify-center items-center border-b">
          <Link
            href="/edge"
            role="button"
            className="py-4 px-6 text-lg w-full bg-black text-center text-white hover:text-white rounded-md hover:bg-gray-900"
          >
            Get Discount via Edge
          </Link>
        </div>
      </section>
      <p className="text-gray-500 mt-3 text-sm text-center">
        This is a static version, compare with the{' '}
        <span className="underline">
          <Link href="/ssr">SSR</Link>
        </span>{' '}
        or{' '}
        <span className="underline">
          <Link href="/edge">Edge</Link>
        </span>{' '}
        version.
      </p>
    </>
  )
}

StaticProductPage.Layout = Layout

export default StaticProductPage
