import type { BrowserContextOptions } from '@playwright/test'

type Cookies = Exclude<
  BrowserContextOptions['storageState'],
  string | undefined
>['cookies']

export default function getAuthCookies(baseURL: string): Cookies {
  const url = new URL(baseURL)

  return [
    {
      httpOnly: true,
      name: 'user',
      value: 'acme',
      domain: url.hostname,
      expires: Date.now() / 1000 + 3600, // 1 hour
      path: '/',
      sameSite: 'Lax',
      secure: baseURL.startsWith('https'),
    },
  ]
}
