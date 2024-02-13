import { decryptOverrides } from '@vercel/flags'
import { cookies } from 'next/headers'
import { Root } from '../generated/generated'

export default async function getVercelFlagOverrides(): Promise<Root | null> {
  const overridesCookieValue = cookies().get('vercel-flag-overrides')?.value
  const overrides = overridesCookieValue
    ? ((await decryptOverrides(overridesCookieValue)) as Root)
    : null

  return overrides
}
