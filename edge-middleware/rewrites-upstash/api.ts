import { Product } from './types'

const PRODUCTS: Product[] = [
  {
    id: 'mug',
    title: 'Vercel Mug',
    description: 'Limited edition',
    price: 15,
    stock: 1,
  },
  {
    id: 'hoodie',
    title: 'Vercel Hoodie',
    description: 'Limited edition',
    price: 35,
    stock: 1,
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
    get: async (product: Product['id']): Promise<boolean> => {
      return await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/get/${product}?_token=${process.env.UPSTASH_REDIS_REST_TOKEN}`
      )
        .then((response) => response.json())
        .then((response) => response.result === 'true')
    },
    set: async (product: Product['id'], hasStock: boolean) => {
      return await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/set/${product}/${hasStock}?_token=${process.env.UPSTASH_REDIS_REST_TOKEN}`
      )
        .then((response) => response.json())
        .then((response) => response.result === 'true')
    },
  },
}

export default api
