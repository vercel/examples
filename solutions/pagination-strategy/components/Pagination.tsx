import Link from 'next/link'
import React from 'react'
import { usePagination } from '../hooks/usePagination'

export type PaginationProps = {
  totalItems: number
  currentPage: number
  renderPageLink: (page: number) => string
  itemsPerPage?: number
}

export const dotts = '...'

const Pagination = ({
  totalItems,
  currentPage,
  itemsPerPage = 10,
  renderPageLink,
}: PaginationProps) => {
  const { currentArray } = usePagination(totalItems, currentPage, itemsPerPage)
  return (
    <div className="flex items-center justify-center my-8">
      {currentArray.map((pageNumber, index) =>
        pageNumber === dotts ? (
          <span
            key={index}
            className="px-4 py-2 rounded-full text-sm font-semibold text-black"
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            href={renderPageLink(pageNumber as number)}
            passHref
            key={index}
          >
            <a
              className={`${
                pageNumber === currentPage ? 'text-success-dark' : 'text-black'
              } px-4 py-2 mx-1 rounded-full text-sm font-semibold no-underline`}
            >
              {pageNumber}
            </a>
          </Link>
        )
      )}
    </div>
  )
}

export default Pagination
