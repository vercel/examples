export const STORE_URL = `https://vercel-merchandise.myshopify.com`
export const DELAY = process.env.NODE_ENV === 'production' ? 250 : 0
export const REGIONS = {
  '1': {
    id: '41891558719737',
    discount: 10,
  },
  '2': {
    id: '41891558752505',
    discount: 20,
  },
  '3': {
    id: '41891558785273',
    discount: 30,
  },
  '4': {
    id: '41891558818041',
    discount: 40,
  },
  '5': {
    id: '41891558850809',
    discount: 50,
  },
  default: {
    id: '41893825478905',
    discount: 0,
  },
}
