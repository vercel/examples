import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";
import { PostCard, postCardFragment } from "./post-card";

export const postsListFragment = graphql(
  `
  fragment PostsList on Post {
    _id
    ...PostCard
  }
`,
  [postCardFragment],
);

export function PostsList(props: {
  posts: FragmentOf<typeof postsListFragment>[];
  error?: Error | null;
}) {
  const { posts, error } = props;

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Error loading posts
        </h2>
        <p className="text-red-600 dark:text-red-300">{error.message}</p>
        <p className="text-sm text-red-500 dark:text-red-400 mt-2">
          Make sure your Sanity GraphQL API is deployed and environment
          variables are configured.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create some posts in your Sanity Studio to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {posts.map((post) => {
        const postData = readFragment(postsListFragment, post);
        return <PostCard key={postData._id} data={postData} />;
      })}
    </div>
  );
}
