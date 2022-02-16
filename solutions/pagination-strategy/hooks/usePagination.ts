import { dotts } from '../components/Pagination'

const usePagination = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const pageNumbersArray = Array.from({ length: totalPages }, (v, i) => i + 1)
  const firstPage = 1

  let currentArray: (string | number)[] = [...pageNumbersArray]

  if (totalPages <= 5) {
    currentArray = pageNumbersArray
  } else if (currentPage >= 1 && currentPage <= 3 && totalPages > 5) {
    currentArray = [firstPage, 2, 3, 4, dotts, totalPages]
  } else if (currentPage < totalPages - 1 && totalPages > 5) {
    currentArray = [
      firstPage,
      dotts,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      dotts,
      totalPages,
    ]
  } else if (currentPage >= totalPages - 2 && totalPages > 5) {
    currentArray = [firstPage, dotts, ...pageNumbersArray.slice(totalPages - 3)]
  }

  return { currentArray }
}

export { usePagination }
