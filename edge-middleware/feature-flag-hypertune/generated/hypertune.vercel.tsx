/* eslint-disable */

import { type FlagOverridesType, encrypt, decrypt } from '@vercel/flags'
import { FlagValues } from '@vercel/flags/react'
import { cookies } from 'next/headers'
import { unstable_flag as flag } from '@vercel/flags/next'
import * as hypertuneTypes from './hypertune'
import getHypertune from '../lib/getHypertune'

export async function getVercelOverride(): Promise<hypertuneTypes.Source | null> {
  const overridesCookieValue = cookies().get('vercel-flag-overrides')?.value

  if (!overridesCookieValue) {
    return null
  }

  const root = (await decrypt<FlagOverridesType>(
    overridesCookieValue
  )) as hypertuneTypes.Root

  return { root }
}

export async function VercelFlagValues({
  flagValues,
}: {
  flagValues: hypertuneTypes.Root
}): Promise<React.ReactElement> {
  const filteredFlagValues = Object.fromEntries(
    Object.entries(flagValues).filter(
      ([flagKey, flagValue]) => !flagKey.startsWith('__')
    )
  )
  const encryptedFlagValues = await encrypt(filteredFlagValues)
  return <FlagValues values={encryptedFlagValues} />
}

export const exampleFlagFlag = flag<boolean>({
  key: 'exampleFlag',
  defaultValue: false,
  origin:
    'https://app.hypertune.com/projects/2583/main/draft/logic?selected_field_path=root%3EexampleFlag',
  description: 'An example flag.',
  options: [
    { label: 'Off', value: false },
    { label: 'On', value: true },
  ],

  async decide(params) {
    const hypertune = await getHypertune(params)
    return hypertune.exampleFlag({ fallback: false })
  },
})
