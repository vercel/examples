import { defineTool } from 'eve/tools'
import { z } from 'zod'
import {
  formatTokenAmount,
  inspectPaymentQuote,
  tickerSchema,
} from '../lib/payment-challenge'

export default defineTool({
  description:
    'Inspect the exact sandbox payment terms for a stock quote without signing or paying. Always call this before buy_stock_quote.',
  inputSchema: z.object({
    ticker: tickerSchema.describe('A US stock ticker, for example AAPL'),
  }),
  async execute({ ticker }, ctx) {
    const quote = await inspectPaymentQuote(ticker, ctx.abortSignal)
    return {
      ...quote,
      currencySymbol: 'USDC',
      humanAmount: formatTokenAmount(quote.amount, quote.decimals),
    }
  },
})
