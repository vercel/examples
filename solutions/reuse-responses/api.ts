import { Product } from "./types"

const PRODUCTS: Product[] = [{
  id: 'mug',
  title: 'Vercel Mug',
  description: 'Limited edition',
  price: 15
}, {
  id: 'hoodie',
  title: 'Vercel Hoodie',
  description: 'Limited edition',
  price: 35
}]

const api = {
  list: async () => {
    console.log('api list method called')

    return PRODUCTS
  },
  fetch: async (id: Product['id']) => {
    console.log('api fetch method called')

    return PRODUCTS.find(product => product.id === id)
  }
}

export default api
