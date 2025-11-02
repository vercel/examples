import Link from "next/link";
import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";

export const postCardFragment = graphql(`
  fragment PostCard on Post {
    _id
    title
    slug {
      current
    }
    excerpt
    publishedAt
  }
`);

export function PostCard(props: { data: FragmentOf<typeof postCardFragment> }) {
  const post = readFragment(postCardFragment, props.data);

  return (
    <article className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold mb-3">
        <Link
          href={`/posts/${post.slug?.current}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
        <time dateTime={post.publishedAt || undefined}>
          {post.publishedAt &&
            new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </time>
        <Link
          href={`/posts/${post.slug?.current}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
