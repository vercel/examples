import { PortableText } from "@portabletext/react";
import { registerUrql } from "@urql/next/rsc";
import { notFound } from "next/navigation";
import { Author, authorFragment } from "@/components/posts/author";
import { PostHeader, postHeaderFragment } from "@/components/posts/post-header";
import { createGraphQLClient, graphql } from "@/lib/graphql";

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

export function generateStaticParams() {
  return [];
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const { data, error } = await getClient().query(GET_POST_BY_SLUG, { slug });
  const post = data?.allPost[0];

  if (error) {
    throw new Error(error.message);
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
