import Link from "next/link";
import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";
import { NavLink } from "./nav-link";
import { navigationLinkFragment } from "./nav-link-fragment";

export const navigationFragment = graphql(
  `
  fragment Navigation on Navigation {
    title
    items {
      _key
      ...NavigationLink
    }
  }
`,
  [navigationLinkFragment],
);

interface NavigationProps {
  data: FragmentOf<typeof navigationFragment>;
}

export function Navigation({ data }: NavigationProps) {
  const navigationData = readFragment(navigationFragment, data);
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-8 sm:px-20">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {navigationData.title}
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navigationData?.items?.map((item) => {
                if (!item) return null;
                return <NavLink key={item._key} data={item} />;
              })}
            </div>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
