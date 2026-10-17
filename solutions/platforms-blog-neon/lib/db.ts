import { neon } from '@neondatabase/serverless'
import { requireEnv } from '@/lib/env'
import type { Post, Site } from '@/lib/neon'

// Server-only Postgres over HTTP for public tenant blogs. Uses the direct
// connection string (never sent to the browser) and reads only published rows.
const sql = neon(requireEnv(process.env.DATABASE_URL, 'DATABASE_URL'))

export async function getSiteBySubdomain(subdomain: string) {
  const rows = (await sql`
    select id, owner_id, name, subdomain, description, created_at
    from sites
    where subdomain = ${subdomain}
    limit 1
  `) as Site[]
  return rows[0] ?? null
}

export async function getPublishedPosts(siteId: number) {
  return (await sql`
    select
      p.id, p.site_id, p.owner_id, p.title,
      coalesce(a.name, p.author) as author,
      p.author_id,
      a.image_key as author_image_key,
      coalesce(nullif(a.image_alt, ''), a.name) as author_image_alt,
      p.content, p.image_key, p.image_alt, p.is_published, p.created_at
    from posts p
    left join authors a on a.id = p.author_id
    where p.site_id = ${siteId} and p.is_published = true
    order by p.created_at desc
  `) as Post[]
}

// True when this object key is referenced by a published post or an author
// who appears on a published post. Runs as the table owner, whose SELECT
// policy only returns published posts.
export async function isPublishedImageKey(imageKey: string) {
  const posts = await sql`
    select 1 from posts
    where image_key = ${imageKey} and is_published = true
    limit 1
  `
  if (posts[0]) return true
  const authors = await sql`
    select 1
    from authors a
    where a.image_key = ${imageKey}
      and exists (
        select 1 from posts p
        where p.author_id = a.id and p.is_published = true
      )
    limit 1
  `
  return Boolean(authors[0])
}

export async function getPublishedPost(siteId: number, postId: number) {
  const rows = (await sql`
    select
      p.id, p.site_id, p.owner_id, p.title,
      coalesce(a.name, p.author) as author,
      p.author_id,
      a.image_key as author_image_key,
      coalesce(nullif(a.image_alt, ''), a.name) as author_image_alt,
      p.content, p.image_key, p.image_alt, p.is_published, p.created_at
    from posts p
    left join authors a on a.id = p.author_id
    where p.site_id = ${siteId} and p.id = ${postId} and p.is_published = true
    limit 1
  `) as Post[]
  return rows[0] ?? null
}
