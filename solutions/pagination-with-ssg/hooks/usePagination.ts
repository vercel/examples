import { dotts } from '../components/Pagination'

export default function usePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const pages = Array.from({ length: totalPages }, (v, i) => i + 1)

  // -> 1 2 3 4 5
  if (totalPages <= 5) {
    return pages
  }
  // -> 1 2 3 4 ... 10
  if (currentPage <= 3) {
    return [1, 2, 3, 4, dotts, totalPages]
  }
  // -> 1 ... 4 5 6 ... 10
  if (currentPage < totalPages - 2) {
    return [
      1,
      dotts,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      dotts,
      totalPages,
    ]
  }
  // -> 1 ... 7 8 9 10
  return [1, dotts, ...pages.slice(totalPages - 4)]
}
