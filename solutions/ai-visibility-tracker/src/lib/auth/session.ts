import 'server-only'
import { cookies } from 'next/headers'
import { DEMO_READ_ONLY_MESSAGE, isDemoMode } from '@/lib/demo'
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  deriveSessionToken,
  isValidSessionToken,
  safeEqual,
} from './token'

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? ''
}

export function isAuthConfigured(): boolean {
  return adminPassword().length > 0
}

export async function verifyPassword(input: string): Promise<boolean> {
  const expected = adminPassword()
  if (!expected) return false
  // Compare derived tokens so the comparison is constant-time regardless of length.
  return safeEqual(
    await deriveSessionToken(input),
    await deriveSessionToken(expected)
  )
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value, adminPassword())
}

export async function createSession(): Promise<void> {
  const store = await cookies()
  store.set({
    name: SESSION_COOKIE,
    value: await deriveSessionToken(adminPassword()),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

/**
 * Null when the current request may change data, otherwise the message to show.
 * Visitors of a demo deployment can read everything but write nothing.
 */
export async function writeDenied(): Promise<string | null> {
  if (await isAuthenticated()) return null
  return isDemoMode() ? DEMO_READ_ONLY_MESSAGE : 'Unauthorized'
}
