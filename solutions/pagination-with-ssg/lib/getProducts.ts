import products from '../mocks/products.json'

/**
 * Paginates the list of products by page, this is one of the ways of doing pagination
 * when you know the total of products and jumping to X page is fast in your DB.
 */
export default async function getProducts({
  limit,
  page,
}: {
  limit: number
  page: number
}) {
  // Usually pagination is done by your DB, and the total is also known by the
  // DB, in this case we're using a demo json so things are simpler.
  const paginatedProducts = products.slice((page - 1) * limit, page * limit)
  return { products: paginatedProducts, total: products.length }
}
