import { PortableText } from "@portabletext/react";
import { registerUrql } from "@urql/next/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Author, authorFragment } from "@/components/posts/author";
import { PostHeader, postHeaderFragment } from "@/components/posts/post-header";
import { createGraphQLClient, graphql } from "@/lib/graphql";

export const dynamic = "force-static";

const { getClient } = registerUrql(createGraphQLClient);

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const GET_POST_BY_SLUG = graphql(
  `
  query GetPostBySlug($slug: String!) {
    allPost(where: { slug: { current: { eq: $slug } } }, limit: 1) {
      excerpt
      contentRaw
      author {
        ...Author
      }
      ...PostHeader
    }
  }
`,
  [authorFragment, postHeaderFragment],
);

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const { data, error } = await getClient().query(GET_POST_BY_SLUG, { slug });
  const post = data?.allPost[0];

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h1 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Error loading post
        </h1>
        <p className="text-red-600 dark:text-red-300">{error.message}</p>
        <Link
          href="/"
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <article>
      <PostHeader data={post} />

      {post.excerpt && (
        <div className="text-xl text-gray-600 dark:text-gray-400 mb-8 italic">
          {post.excerpt}
        </div>
      )}

      {post.contentRaw && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={post.contentRaw} />
        </div>
      )}

      {post.author && <Author data={post.author} />}
    </article>
  );
}
