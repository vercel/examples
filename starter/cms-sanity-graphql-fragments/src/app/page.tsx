import { registerUrql } from "@urql/next/rsc";
import { PostsList, postsListFragment } from "@/components/posts/posts-list";
import { createGraphQLClient, graphql } from "@/lib/graphql";

const GET_HOME_PAGE = graphql(
  `
  query GetHomePage($limit: Int, $offset: Int) {
    allPost(limit: $limit, offset: $offset, sort: [{ publishedAt: DESC }]) {
      ...PostsList
    }
  }
`,
  [postsListFragment],
);

const { getClient } = registerUrql(createGraphQLClient);

export default async function Home() {
  const { data, error } = await getClient().query(GET_HOME_PAGE, {
    limit: 10,
    offset: 0,
  });
  const posts = data?.allPost ?? [];

  return (
    <>
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">CMS GraphQL Fragments</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A Next.js blog powered by Sanity CMS and GraphQL
        </p>
      </header>

      <PostsList posts={posts} error={error} />
    </>
  );
}
