import { type FlagOverridesType, decrypt } from '@vercel/flags'
import { cookies } from 'next/headers'
import { Root } from '../generated/hypertune'

export default async function getVercelFlagOverrides(): Promise<Root | null> {
  const overridesCookieValue = cookies().get('vercel-flag-overrides')?.value
  const overrides = overridesCookieValue
    ? ((await decrypt<FlagOverridesType>(overridesCookieValue)) as Root)
    : null

  return overrides
}
