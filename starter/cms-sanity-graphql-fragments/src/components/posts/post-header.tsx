import Link from "next/link";
import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";

export const postHeaderFragment = graphql(`
  fragment PostHeader on Post {
    title
    publishedAt
  }
`);

export function PostHeader(props: {
  data: FragmentOf<typeof postHeaderFragment>;
}) {
  const header = readFragment(postHeaderFragment, props.data);
  const publishedAt = header.publishedAt;

  return (
    <header className="mb-8">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to posts
      </Link>
      <h1 className="text-4xl font-bold mb-4">{header.title}</h1>
      {publishedAt && (
        <time
          dateTime={publishedAt}
          className="text-gray-600 dark:text-gray-400"
        >
          {new Date(publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      )}
    </header>
  );
}
