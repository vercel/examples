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

function PaginatedPage({ products, currentPage, totalProducts }: PageProps) {
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

  // Redirect the first page to `/category` to avoid duplicated content
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
  return {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    paths: Array.from({ length: 5 }).map((_, i) => `/category/${i + 2}`),
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  }
}

export default PaginatedPage
