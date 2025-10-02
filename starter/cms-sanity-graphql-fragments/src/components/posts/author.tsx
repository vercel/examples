import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";

export const authorFragment = graphql(`
  fragment Author on Author {
    _id
    name
    bio
  }
`);

export function Author(props: { data: FragmentOf<typeof authorFragment> }) {
  const author = readFragment(authorFragment, props.data);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xl font-semibold">
          {author.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {author.name}
          </h3>
          {author.bio && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {author.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
