import { createClient } from '@neondatabase/neon-js'
import { requireEnv } from '@/lib/env'

const AUTH_URL = requireEnv(
  process.env.NEXT_PUBLIC_NEON_AUTH_URL,
  'NEXT_PUBLIC_NEON_AUTH_URL'
)
const DATA_API_URL = requireEnv(
  process.env.NEXT_PUBLIC_NEON_DATA_API_URL,
  'NEXT_PUBLIC_NEON_DATA_API_URL'
)

// Data API client for the dashboard: `neon.auth` handles sign in/up/sessions,
// `neon.from(...)` runs queries with the user's JWT attached, so RLS sees
// `auth.user_id()`.
export const neon = createClient({
  auth: { url: AUTH_URL },
  dataApi: { url: DATA_API_URL },
})

// The current Neon Auth JWT, for our own authorized requests (image upload).
export const getAccessToken = async () => {
  const { data } = await neon.auth.getSession()
  return data?.session?.token ?? null
}

export type Site = {
  id: number
  owner_id: string
  name: string
  subdomain: string
  description: string
  created_at: string
}

export type Post = {
  id: number
  site_id: number
  owner_id: string
  title: string
  author: string
  author_id: number | null
  author_image_key?: string | null
  author_image_alt?: string | null
  content: string
  image_key: string | null
  image_alt: string
  is_published: boolean
  created_at: string
}

export type Author = {
  id: number
  site_id: number
  owner_id: string
  name: string
  image_key: string | null
  image_alt: string
  created_at: string
}
