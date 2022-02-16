import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import React from 'react'
import { getProducts } from '../../utils/getProducts'
import { Layout, Page } from '@vercel/examples-ui'
import Head from 'next/head'
import { createPagination } from '../../utils/createPagination'
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
  const products = await getProducts(1000)
  const totalProducts = products.length

  const currentPage = params?.page as string
  const currentPageNumber = parseInt(currentPage, 10) || 1

  const currentProducts = await createPagination(products, PER_PAGE)[
    currentPage
  ]

  if (!currentProducts) {
    return {
      notFound: true,
    }
  }

  // This can be also set in next.config.js but it's better to keep it here
  if (currentPageNumber === 1) {
    return {
      redirect: {
        destination: '/category',
        permanent: false,
      },
    }
  }

  return {
    props: {
      products: currentProducts,
      currentPage: currentPageNumber,
      totalProducts,
    },
    revalidate: 60 * 60 * 24, // once a day
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prerenderPages = 5
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
    fallback: 'blocking',
  }
}

export default PaginatedPage
