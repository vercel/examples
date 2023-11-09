import { Product } from './types'

function getRandomPrice(): number {
  return Math.floor(Math.random() * 60)
}

function getRandomHasStock(): boolean {
  return Math.random() > 0.5
}

const api = {
  list: async (): Promise<Product[]> => [
    {
      id: 'headphones',
      title: 'Vercedge headphones V3',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ampauto=format&ampfit=crop&ampw=2100&ampq=80',
      description: 'Edge level quality',
      price: `$${getRandomPrice()}.00`,
      category: 'Technology',
      hasStock: getRandomHasStock(),
    },
    {
      id: 'glasses',
      title: 'Versun super sun glasses',
      image:
        'https://images.unsplash.com/photo-1563903530908-afdd155d057a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
      description: 'Embellished square sunglasses',
      price: `$${getRandomPrice()}.00`,
      category: 'Jewelry',
      hasStock: getRandomHasStock(),
    },
    {
      id: 'watch',
      title: 'Verseconds watch',
      image:
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
      description: 'Time with colors and widgets',
      price: `$${getRandomPrice()}.00`,
      category: 'Technology',
      hasStock: getRandomHasStock(),
    },
    {
      id: 'bike',
      title: 'Bikecel magic bike',
      image:
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2016&q=80',
      description: 'Moving at the speed of edge',
      price: `$${getRandomPrice()}.00`,
      category: 'Sports',
      hasStock: getRandomHasStock(),
    },
  ],
}

export default api
