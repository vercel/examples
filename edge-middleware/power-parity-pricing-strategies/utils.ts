export function getDiscountedPrice(price: number, discount: number): string {
  return Number(price * ((100 - discount) / 100)).toLocaleString('en-US', {
    currency: 'USD',
  })
}
