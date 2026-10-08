'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Text, Link as UILink } from '@vercel/examples-ui'
import { neon, type Site } from '@/lib/neon'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function SiteList() {
  const [sites, setSites] = useState<Site[]>([])
  const [name, setName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  // RLS scopes this to the signed-in user's own sites.
  const load = useCallback(async () => {
    const { data, error } = await neon
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setSites((data as Site[]) ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function createSite(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const { error } = await neon
      .from('sites')
      .insert({ name, subdomain: slugify(subdomain || name), description: '' })

    setPending(false)
    if (error) {
      setError(
        error.message.includes('duplicate')
          ? 'That subdomain is taken. Try another.'
          : error.message
      )
      return
    }
    setName('')
    setSubdomain('')
    await load()
  }

  async function remove(site: Site) {
    const { error } = await neon.from('sites').delete().eq('id', site.id)
    if (error) setError(error.message)
    else await load()
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={createSite} className="flex flex-col gap-3">
        <Text variant="h2">New site</Text>
        <Input
          placeholder="Site name (e.g. Acme Blog)"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <div className="flex items-center gap-2">
          <Input
            placeholder="subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(slugify(e.currentTarget.value))}
          />
          <Text className="text-gray-500 text-sm">.{ROOT_DOMAIN}</Text>
        </div>
        <Button type="submit" variant="black" loading={pending}>
          Create site
        </Button>
      </form>

      {error && <Text className="text-red-600">{error}</Text>}

      <div className="flex flex-col gap-4">
        <Text variant="h2">Your sites</Text>
        {sites.length === 0 && (
          <Text>No sites yet. Create your first one above.</Text>
        )}
        {sites.map((site) => (
          <div
            key={site.id}
            className="border rounded-md p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-4">
              <Text className="font-semibold">{site.name}</Text>
              <UILink
                href={`http://${site.subdomain}.${ROOT_DOMAIN}`}
                target="_blank"
              >
                {site.subdomain}.{ROOT_DOMAIN} ↗
              </UILink>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/${site.subdomain}`}>
                <Button variant="secondary">Manage posts</Button>
              </Link>
              <Button variant="secondary" onClick={() => remove(site)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
