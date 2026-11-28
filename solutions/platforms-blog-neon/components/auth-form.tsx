'use client'

import { useState, type FormEvent } from 'react'
import { Button, Input, Text } from '@vercel/examples-ui'
import { neon } from '@/lib/neon'
import { useSession } from '@/lib/session'

type Mode = 'sign-in' | 'sign-up'

export function AuthForm({ onAuthed }: { onAuthed?: () => void }) {
  const { refresh } = useSession()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const { error } =
      mode === 'sign-up'
        ? await neon.auth.signUp.email({ email, password, name })
        : await neon.auth.signIn.email({ email, password })

    setPending(false)

    if (error) {
      setError(error.message ?? 'Something went wrong. Please try again.')
      return
    }

    await refresh()
    onAuthed?.()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === 'sign-up' && (
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
      )}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
      />

      {error && (
        <Text className="text-red-600" variant="body">
          {error}
        </Text>
      )}

      <Button type="submit" variant="black" loading={pending}>
        {mode === 'sign-up' ? 'Create account' : 'Sign in'}
      </Button>

      <button
        type="button"
        className="text-sm text-gray-500 underline"
        onClick={() => {
          setError(null)
          setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')
        }}
      >
        {mode === 'sign-up'
          ? 'Already have an account? Sign in'
          : "Don't have an account? Create one"}
      </button>
    </form>
  )
}
