import { promises as fs } from 'fs'
import path from 'path'
import { Product } from './types'

const PRODUCTS: Product[] = [
  {
    id: 'mug',
    title: 'Vercel Mug',
    description: 'Limited edition',
    price: 15,
  },
  {
    id: 'hoodie',
    title: 'Vercel Hoodie',
    description: 'Limited edition',
    price: 35,
  },
]

const api = {
  list: async () => {
    return PRODUCTS
  },
  fetch: async (id: Product['id']) => {
    return PRODUCTS.find((product) => product.id === id)
  },
  cache: {
    get: async (id: string): Promise<Product | null | undefined> => {
      const data = await fs.readFile(path.join(process.cwd(), 'products.db'))
      const products: Product[] = JSON.parse(data as unknown as string)

      return products.find((product) => product.id === id)
    },
    set: async (products: Product[]) => {
      return await fs.writeFile(
        path.join(process.cwd(), 'products.db'),
        JSON.stringify(products)
      )
    },
  },
}

export default api
