import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Page, Text } from '@vercel/examples-ui'
import { AuthorByline } from '@/components/author-byline'
import { getPublishedPosts, getSiteBySubdomain } from '@/lib/db'
import { imageSrc } from '@/lib/images'
import { excerpt } from '@/lib/markdown'

export const dynamic = 'force-dynamic'

export default async function TenantBlog({
  params,
}: {
  params: Promise<{ subdomain: string }>
}) {
  const { subdomain } = await params
  const site = await getSiteBySubdomain(subdomain)
  if (!site) notFound()
  const posts = await getPublishedPosts(site.id)
  return (
    <Page className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <Text variant="h1">{site.name}</Text>
        {site.description && (
          <Text className="text-gray-500">{site.description}</Text>
        )}
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length === 0 && (
          <Text className="sm:col-span-2 lg:col-span-3">
            No posts published yet.
          </Text>
        )}
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.id}`}
            className="border border-gray-200 rounded-md overflow-hidden flex flex-col hover:border-gray-400 min-w-0"
          >
            {post.image_key && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc(post.image_key)}
                alt={post.image_alt || post.title}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="flex flex-col gap-2 p-4 min-w-0">
              <Text className="font-semibold">{post.title}</Text>
              {post.author && (
                <AuthorByline
                  name={post.author}
                  imageKey={post.author_image_key}
                  imageAlt={post.author_image_alt}
                />
              )}
              {post.content && (
                <Text className="text-sm text-gray-600 line-clamp-2">
                  {excerpt(post.content)}
                </Text>
              )}
            </div>
          </Link>
        ))}
      </section>
    </Page>
  )
}
