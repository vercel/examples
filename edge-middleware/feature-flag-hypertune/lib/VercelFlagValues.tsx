import { encrypt } from '@vercel/flags'
import { FlagValues } from '@vercel/flags/react'
import { Root } from '../generated/generated'

export default async function VercelFlagValues({
  flagValues,
}: {
  flagValues: Root
}) {
  const filteredFlagValues = Object.fromEntries(
    Object.entries(flagValues).filter(
      ([flagKey, flagValue]) => !flagKey.startsWith('__'),
    ),
  )
  const encryptedFlagValues = await encrypt(filteredFlagValues)
  return <FlagValues values={encryptedFlagValues} />
}
