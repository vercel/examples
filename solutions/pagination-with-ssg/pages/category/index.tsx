import { Layout, Page } from '@vercel/examples-ui'
import { GetStaticProps } from 'next'
import { getProducts } from '../../utils/getProducts'
import { createPagination } from '../../utils/createPagination'
import { PER_PAGE } from '../category/[page]'
import PaginationPage from '../../components/PaginatedPage'

function Home({ products, totalProducts, currentPage }: any) {
  return (
    <Page>
      <PaginationPage
        products={products}
        currentPage={currentPage}
        totalProducts={totalProducts}
        perPage={PER_PAGE}
      />
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts(1000)
  const totalProducts = products.length

  // Landing page
  const currentProducts = await createPagination(products, PER_PAGE)[1]

  return {
    props: {
      products: currentProducts,
      currentPage: 1,
      totalProducts,
    },
  }
}

Home.Layout = Layout

export default Home
