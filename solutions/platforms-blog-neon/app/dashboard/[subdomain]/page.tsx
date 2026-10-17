'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button, Page, Text, Link as UILink } from '@vercel/examples-ui'
import { AuthorManager } from '@/components/author-manager'
import { PostManager } from '@/components/post-manager'
import { neon, type Author, type Site } from '@/lib/neon'
import { useSession } from '@/lib/session'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'

export default function ManageSitePage() {
  const router = useRouter()
  const params = useParams<{ subdomain: string }>()
  const { user, loading } = useSession()
  const [site, setSite] = useState<Site | null>(null)
  const [authors, setAuthors] = useState<Author[]>([])
  const [notFound, setNotFound] = useState(false)

  const loadSite = useCallback(async () => {
    // RLS only returns the site if the signed-in user owns it.
    const { data } = await neon
      .from('sites')
      .select('*')
      .eq('subdomain', params.subdomain)
      .limit(1)
    const found = (data as Site[])?.[0] ?? null
    setSite(found)
    setNotFound(!found)
    if (!found) return
    const { data: authorRows } = await neon
      .from('authors')
      .select('*')
      .eq('site_id', found.id)
      .order('created_at', { ascending: true })
    setAuthors((authorRows as Author[]) ?? [])
  }, [params.subdomain])

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (user) loadSite()
  }, [user, loadSite])

  if (loading || !user) {
    return (
      <Page>
        <Text>Loading…</Text>
      </Page>
    )
  }

  if (notFound) {
    return (
      <Page className="flex flex-col gap-4">
        <Text variant="h1">Site not found</Text>
        <Text>You do not have a site with that subdomain.</Text>
        <Link href="/dashboard">
          <Button variant="secondary">Back to your sites</Button>
        </Link>
      </Page>
    )
  }

  if (!site) {
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
          <Text variant="h1">{site.name}</Text>
          <UILink
            href={`http://${site.subdomain}.${ROOT_DOMAIN}`}
            target="_blank"
          >
            {site.subdomain}.{ROOT_DOMAIN} ↗
          </UILink>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary">All sites</Button>
        </Link>
      </div>

      <AuthorManager site={site} authors={authors} onChange={loadSite} />
      <PostManager site={site} authors={authors} />
    </Page>
  )
}
