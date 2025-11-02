'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import ms from 'ms'

export async function hideBanner() {
  const store = await cookies()

  store.set('banner-hidden', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + ms('30d')),
    path: '/',
  })

  revalidatePath('/', 'layout')
}
