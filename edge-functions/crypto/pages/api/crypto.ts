import crypto from 'crypto'
import { NextResponse } from 'next/server'
// const crypto = require('node:crypto').webcrypto

// ------------------
// Using Crypto with Edge Functions
// ------------------

export default async function CryptoEdgeAPIRoute() {
  // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle
  const plainText = 'Hello from the Edge!'
  const password = 'hunter2'
  const ptUtf8 = new TextEncoder().encode(plainText)
  const pwUtf8 = new TextEncoder().encode(password)
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
  return new NextResponse(
    JSON.stringify({
      // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
      uuid: crypto.randomUUID(),
      // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
      randomValues: crypto.getRandomValues(new Uint32Array(10)),
      plainText,
      password,
      decryptedText,
      iv,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}

export const config = {
  runtime: 'experimental-edge',
}
