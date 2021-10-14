import type { Country, Product } from './types'

// @TODO: All of this is just a placeholder for now.
const DELAY = process.env.NODE_ENV === 'production' ? 250 : 0
const PRODUCT: Product = {
  id: 'mug-nextjs',
  name: 'Vercel Mug',
  description: 'Limited Edition',
  price: 15,
  image: '/mug.png',
  discount: 5,
}
const PRODUCTS: Record<string, Product> = {
  us: {
    ...PRODUCT,
    discount: 10,
  },
  ar: {
    ...PRODUCT,
    name: 'Taza Vercel',
    description: 'Edición Limitada',
    discount: 75,
  },
  uk: {
    ...PRODUCT,
    discount: 15,
  },
  jp: {
    ...PRODUCT,
    name: 'Vercel マグ',
    description: '限定版',
    discount: 15,
  },
  cn: {
    ...PRODUCT,
    name: 'Vercel 马克杯',
    description: '限量版',
    discount: 30,
  },
  au: {
    ...PRODUCT,
    discount: 20,
  },
  de: {
    ...PRODUCT,
    name: 'Vercel Becher',
    description: 'Limitierte Auflage, beschränkte Auflage',
    discount: 25,
  },
}

export default {
  product: {
    fetch: async ({
      country,
    }: { country?: Country } = {}): Promise<Product> => {
      let product = PRODUCT

      if (country && PRODUCTS[country]) {
        product = PRODUCTS[country]
      }

      let delay = DELAY
      if (country === 'jp') {
        delay = 1250
      }

      return new Promise((resolve) => setTimeout(() => resolve(product), delay))
    },
    countries: async (): Promise<Country[]> =>
      Object.keys(PRODUCTS) as Country[],
  },
}
