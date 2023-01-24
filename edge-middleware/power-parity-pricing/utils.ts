export function getParityPrice(price: number, parity: number): string {
  return Number(Math.round(price - (parity * price) / 100)).toLocaleString(
    'en-US',
    { currency: 'USD' }
  )
}
