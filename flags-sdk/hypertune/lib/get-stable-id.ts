import { dedupe } from 'flags/next'
import { cookies, headers } from 'next/headers'
import { xxHash32 } from 'js-xxhash'

export const getStableId: () => Promise<string> = dedupe(async () => {
  const [cookiesStore, headersStore] = await Promise.all([cookies(), headers()])
  const nonce = cookiesStore.get('nonce')?.value ?? '0'
  const xForwardedFor = headersStore.get('x-forwarded-for') ?? '0'
  const date = new Date().toISOString().substring(0, 10)
  return Math.abs(xxHash32(`${nonce}-${xForwardedFor}-${date}`)).toString(36)
})
