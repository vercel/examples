import type { BrowserContextOptions } from '@playwright/test'
import generateUsername from './generate-username'

export type StorageState = Exclude<
  BrowserContextOptions['storageState'],
  string | undefined
>

export function getAuthState(baseURL: string): StorageState {
  const url = new URL(baseURL)

  return {
    cookies: [
      {
        httpOnly: true,
        name: 'user',
        value: generateUsername(),
        domain: url.hostname,
        expires: Date.now() / 1000 + 3600, // 1 hour
        path: '/',
        sameSite: 'Lax',
        secure: baseURL.startsWith('https'),
      },
    ],
    origins: [],
  }
}
