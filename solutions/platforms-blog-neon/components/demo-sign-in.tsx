'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, Text } from '@vercel/examples-ui'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demo'
import { neon } from '@/lib/neon'
import { useSession } from '@/lib/session'

export function DemoSignIn({
  onAuthed,
  redirectTo,
}: {
  onAuthed?: () => void
  redirectTo?: string
}) {
  const router = useRouter()
  const { refresh } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function signInDemo() {
    setError(null)
    setPending(true)
    const { error } = await neon.auth.signIn.email({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
    setPending(false)
    if (error) {
      setError(error.message ?? 'Demo sign-in failed')
      return
    }
    await refresh()
    onAuthed?.()
    if (redirectTo) router.push(redirectTo)
  }

  return (
    <div className="border rounded-md p-4 flex flex-col gap-3 bg-gray-50">
      <Text variant="h2">Demo login</Text>
      <Text className="text-sm text-gray-600">
        Use the shared account to browse the sample tenants, authors, and posts.
      </Text>
      <div className="text-sm font-mono flex flex-col gap-1">
        <span>Email: {DEMO_EMAIL}</span>
        <span>Password: {DEMO_PASSWORD}</span>
      </div>
      {error && <Text className="text-red-600">{error}</Text>}
      <Button
        type="button"
        variant="black"
        loading={pending}
        onClick={signInDemo}
      >
        Sign in as demo
      </Button>
    </div>
  )
}
