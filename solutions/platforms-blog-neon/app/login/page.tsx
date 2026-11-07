'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Page, Text } from '@vercel/examples-ui'
import { AuthForm } from '@/components/auth-form'
import { DemoSignIn } from '@/components/demo-sign-in'
import { useSession } from '@/lib/session'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useSession()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  return (
    <Page className="flex flex-col gap-6 max-w-sm">
      <Text variant="h1">Welcome</Text>
      <Text>Sign in with Neon Auth to manage your posts.</Text>
      <DemoSignIn onAuthed={() => router.replace('/dashboard')} />
      <Text className="text-sm text-gray-500">Or use your own account</Text>
      <AuthForm onAuthed={() => router.replace('/dashboard')} />
    </Page>
  )
}
