import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Page, Text } from '@vercel/examples-ui'
import { AuthorByline } from '@/components/author-byline'
import { Markdown } from '@/components/markdown'
import { getPublishedPost, getSiteBySubdomain } from '@/lib/db'
import { imageSrc } from '@/lib/images'

export const dynamic = 'force-dynamic'

export default async function TenantPost({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>
}) {
  const { subdomain, id } = await params
  const postId = Number(id)
  if (!Number.isInteger(postId) || postId <= 0) notFound()
  const site = await getSiteBySubdomain(subdomain)
  if (!site) notFound()
  const post = await getPublishedPost(site.id, postId)
  if (!post) notFound()
  return (
    <Page className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← {site.name}
      </Link>
      <div className="flex flex-col gap-2">
        <Text variant="h1">{post.title}</Text>
        {post.author && (
          <AuthorByline
            name={post.author}
            imageKey={post.author_image_key}
            imageAlt={post.author_image_alt}
            className="text-gray-500"
          />
        )}
      </div>
      {post.image_key && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={post.image_alt || post.title}
          className="rounded-md w-full object-cover"
          src={imageSrc(post.image_key)}
        />
      )}
      {post.content && <Markdown>{post.content}</Markdown>}
    </Page>
  )
}
