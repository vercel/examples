import { Composio } from '@composio/core'
import { VercelProvider } from '@composio/vercel'
import { env } from '~/env'

export function createComposioClient() {
  return new Composio({
    apiKey: env.COMPOSIO_API_KEY,
    provider: new VercelProvider(),
  })
}
