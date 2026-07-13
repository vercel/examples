import { isAddress } from '@solana/addresses'
import { z } from 'zod'

export const tickerSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{1,5}$/, 'Use a 1-5 letter US stock ticker')

export const tokenAmountSchema = z.string().regex(/^\d+$/).max(20)

export const solanaAddressSchema = z
  .string()
  .refine(isAddress, 'Use a valid base58-encoded Solana address')

const challengeSchema = z.object({
  amount: tokenAmountSchema,
  currency: solanaAddressSchema,
  methodDetails: z.object({
    decimals: z.number().int().nonnegative(),
    network: z.literal('localnet'),
  }),
  recipient: solanaAddressSchema,
})

export type PaymentQuote = {
  amount: string
  currencyMint: string
  decimals: number
  network: 'localnet'
  recipient: string
  ticker: string
}

export function quoteUrl(ticker: string): string {
  return `https://debugger.pay.sh/mpp/quote/${encodeURIComponent(ticker)}`
}

export async function inspectPaymentQuote(
  ticker: string,
  signal?: AbortSignal
): Promise<PaymentQuote> {
  const response = await fetch(quoteUrl(ticker), {
    cache: 'no-store',
    headers: { accept: 'application/problem+json' },
    signal,
  })

  if (response.status !== 402) {
    throw new Error(
      `Expected an HTTP 402 payment challenge, received ${response.status}`
    )
  }

  const authenticate = response.headers.get('www-authenticate')
  const encodedRequest = authenticate?.match(/(?:^|,\s*)request="([^"]+)"/)?.[1]
  if (!encodedRequest) {
    throw new Error(
      'The endpoint did not return a supported MPP payment challenge'
    )
  }

  const decoded = Buffer.from(encodedRequest, 'base64url').toString('utf8')
  const challenge = challengeSchema.parse(JSON.parse(decoded))

  return {
    amount: challenge.amount,
    currencyMint: challenge.currency,
    decimals: challenge.methodDetails.decimals,
    network: challenge.methodDetails.network,
    recipient: challenge.recipient,
    ticker,
  }
}

export function formatTokenAmount(amount: string, decimals: number): string {
  if (decimals === 0) return amount

  const padded = amount.padStart(decimals + 1, '0')
  const whole = padded.slice(0, -decimals) || '0'
  const fraction = padded.slice(-decimals).replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : whole
}
