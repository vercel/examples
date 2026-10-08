'use server'

import { redirect } from 'next/navigation'
import {
  createSession,
  destroySession,
  isAuthConfigured,
  verifyPassword,
} from '@/lib/auth/session'

export interface LoginState {
  error: string | null
}

export async function login(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return {
      error:
        'ADMIN_PASSWORD is not set. Add it to the environment and restart.',
    }
  }
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/')
  if (!(await verifyPassword(password))) {
    // A small fixed delay keeps online guessing slow without any state.
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { error: 'Wrong password.' }
  }
  await createSession()
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/')
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect('/login')
}
