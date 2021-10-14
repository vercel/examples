export function getDiscountedPrice(price: number, discount: number): string {
  return Number(Math.round(price - (discount * price) / 100)).toLocaleString(
    'en-US',
    { currency: 'USD' }
  )
}
