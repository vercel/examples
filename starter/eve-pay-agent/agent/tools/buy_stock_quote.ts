import { defineTool } from 'eve/tools'
import { always } from 'eve/tools/approval'
import { z } from 'zod'
import {
  inspectPaymentQuote,
  quoteUrl,
  solanaAddressSchema,
  tickerSchema,
  tokenAmountSchema,
} from '../lib/payment-challenge'

const approvedQuoteSchema = z.object({
  amount: tokenAmountSchema.describe('Approved token amount in base units'),
  currencyMint: solanaAddressSchema.describe('Approved payment token mint'),
  decimals: z.number().int().nonnegative().describe('Approved token decimals'),
  network: z.literal('localnet').describe('Approved Solana network'),
  recipient: solanaAddressSchema.describe('Approved payment recipient'),
  ticker: tickerSchema.describe('The inspected stock ticker'),
})

export default defineTool({
  description:
    'Buy one stock quote with Pay.sh sandbox funds. The user must approve every call after reviewing amount, token, recipient, and network.',
  inputSchema: approvedQuoteSchema,
  approval: always(),
  async execute(approved, ctx) {
    const current = await inspectPaymentQuote(approved.ticker, ctx.abortSignal)

    for (const field of [
      'amount',
      'currencyMint',
      'decimals',
      'network',
      'recipient',
      'ticker',
    ] as const) {
      if (current[field] !== approved[field]) {
        throw new Error(
          `Payment terms changed at ${field}; no payment was made. Inspect the quote again.`
        )
      }
    }

    const sandbox = await ctx.getSandbox()
    const url = quoteUrl(approved.ticker)
    const result = await sandbox.run({
      command: `npx --yes @solana/pay@1.0.20 --no-dna --sandbox fetch ${JSON.stringify(
        url
      )}`,
    })

    if (result.exitCode !== 0) {
      throw new Error(
        `Pay.sh exited with code ${result.exitCode}: ${result.stderr.trim()}`
      )
    }

    const output = result.stdout.trim()
    let quote: unknown = output
    try {
      quote = JSON.parse(output)
    } catch {
      // Paid APIs may return text. Keeping it as text is still JSON-serializable.
    }

    return {
      payment: approved,
      quote,
      sandbox: true,
    }
  },
})
