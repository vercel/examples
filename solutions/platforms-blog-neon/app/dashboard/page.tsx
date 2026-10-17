'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button, Page, Text } from '@vercel/examples-ui'
import { SiteList } from '@/components/site-list'
import { useSession } from '@/lib/session'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, signOut } = useSession()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <Page>
        <Text>Loading…</Text>
      </Page>
    )
  }

  return (
    <Page className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <Text variant="h1">Your sites</Text>
          <Text className="text-gray-500">Signed in as {user.email}</Text>
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            await signOut()
            router.replace('/login')
          }}
        >
          Sign out
        </Button>
      </div>

      <SiteList />
    </Page>
  )
}
