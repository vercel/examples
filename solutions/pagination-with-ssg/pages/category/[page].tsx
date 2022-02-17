import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import React from 'react'
import getProducts from '../../lib/getProducts'
import { Layout, Page } from '@vercel/examples-ui'
import Head from 'next/head'
import PaginationPage from '../../components/PaginatedPage'

type PageProps = {
  products: any[]
  currentPage: number
  totalProducts: number
}

export const PER_PAGE = 10

const PaginatedPage = ({ products, currentPage, totalProducts }: PageProps) => {
  return (
    <Page>
      <Head>
        <title>Page {currentPage} - SSG Pagination Example</title>
        <meta
          name="description"
          content={`Statically generated page ${currentPage}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PaginationPage
        products={products}
        currentPage={currentPage}
        totalProducts={totalProducts}
        perPage={PER_PAGE}
      />
    </Page>
  )
}

PaginatedPage.Layout = Layout

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const page = Number(params?.page) || 1
  const { products, total } = await getProducts({ limit: PER_PAGE, page })

  if (!products.length) {
    return {
      notFound: true,
    }
  }

  if (page === 1) {
    return {
      redirect: {
        destination: '/category',
        permanent: false,
      },
    }
  }

  return {
    props: {
      products,
      totalProducts: total,
      currentPage: page,
    },
    revalidate: 60 * 60 * 24, // <--- ISR cache: once a day
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prerenderPages = 5 // <--- number of pages to prerender and rest leave to build on the fly

  const pagesCount = Array.from(Array(prerenderPages).keys()).map(
    (page) => page + 1
  )
  const urlsArray = []

  for (const url of pagesCount) {
    if (url !== 1) {
      urlsArray.push(`/category/${url}`)
    }
  }

  return {
    paths: urlsArray,
    fallback: 'blocking', // <--- this will build on the fly but blocking
  }
}

export default PaginatedPage
