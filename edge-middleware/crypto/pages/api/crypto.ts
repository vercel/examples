import type { NextRequest } from 'next/server'

// ------------------
// Using Crypto with Edge Functions
// ------------------

export const config = {
  runtime: 'experimental-edge',
}

export default async function CryptoEdgeAPIRoute(request: NextRequest) {
  const url = request.nextUrl
  const fromMiddleware = url.searchParams.get('token') ?? 'unset'

  const plainText = 'Hello from the Edge!'
  const password = 'hunter2'
  const ptUtf8 = new TextEncoder().encode(plainText)
  const pwUtf8 = new TextEncoder().encode(password)

  // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)

  // Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const alg = { name: 'AES-GCM', iv: iv }
  const encrpytKey = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'encrypt',
  ])
  const encrypted = await crypto.subtle.encrypt(alg, encrpytKey, ptUtf8)

  // Decrypt
  const decryptKey = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'decrypt',
  ])
  const ptBuffer = await crypto.subtle.decrypt(alg, decryptKey, encrypted)
  const decryptedText = new TextDecoder().decode(ptBuffer)

  return new Response(
    JSON.stringify({
      // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
      uuid: crypto.randomUUID(),
      // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
      randomValues: crypto.getRandomValues(new Uint32Array(10)),
      plainText,
      password,
      decryptedText,
      iv,
      fromMiddleware,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
