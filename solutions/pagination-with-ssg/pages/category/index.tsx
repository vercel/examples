import { GetStaticProps } from 'next'
import { Layout, Page } from '@vercel/examples-ui'
import getProducts from '../../lib/getProducts'
import { PER_PAGE } from '../category/[page]'
import PaginationPage from '../../components/PaginatedPage'

function Category({ products, totalProducts, currentPage }: any) {
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
  const { products, total } = await getProducts({ limit: PER_PAGE, page: 1 })

  return {
    props: {
      products,
      totalProducts: total,
      currentPage: 1,
    },
  }
}

Category.Layout = Layout

export default Category
