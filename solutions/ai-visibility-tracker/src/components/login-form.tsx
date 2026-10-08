'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '@/app/actions/auth'
import { Field } from '@/components/blocks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const initialState: LoginState = { error: null }

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initialState)
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
        />
      </Field>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
