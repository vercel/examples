import { cookies } from 'next/headers'
import { MarketingA } from './a'
import { MarketingB } from './b'
import { createSplitClient } from '@lib/split'

// export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function Marketing() {
  const userKey = cookies().get('split-userkey')?.value ?? 'anonymous'
  const client = await createSplitClient(userKey)
  const treatment = await client.getTreatment('New_Marketing_Page')

  await client.destroy() // TODO can we use waitUntil(client.destroy()) somehow?

  return treatment === 'on' ? <MarketingB /> : <MarketingA />
}
