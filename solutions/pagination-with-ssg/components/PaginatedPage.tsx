import React from 'react'
import { Text } from '@vercel/examples-ui'
import Pagination from './Pagination'

type PageProps = {
  products: any[]
  currentPage: number
  totalProducts: number
  perPage: number
}

const ProductCard = ({ name, description, price }: any) => (
  <div className="my-10 border-2 border-sky-500 p-3">
    <Text variant="h2">{name}</Text>
    <Text variant="smallText" className="my-3">
      ${price}
    </Text>
    <Text variant="body" className="my-8">
      {description}
    </Text>
  </div>
)

const PaginationPage = ({
  currentPage,
  totalProducts,
  perPage,
  products,
}: PageProps): JSX.Element => {
  return (
    <div>
      <Text variant="h1">Page {currentPage}</Text>
      <Pagination
        totalItems={totalProducts}
        currentPage={currentPage}
        itemsPerPage={perPage}
        renderPageLink={(page) => `/category/${page}`}
      />
      <div className="grid grid-cols-3 gap-8">
        {products.map((product, i) => (
          <ProductCard key={i} {...product} />
        ))}
      </div>
    </div>
  )
}

export default PaginationPage
