"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FragmentOf, readFragment } from "@/lib/graphql";
import { navigationLinkFragment } from "./nav-link-fragment";

interface NavigationProps {
  data: FragmentOf<typeof navigationLinkFragment>;
}

export const NavLink = ({ data }: NavigationProps) => {
  const navLinkData = readFragment(navigationLinkFragment, data);
  const pathname = usePathname();

  if (!navLinkData.href) return null;
  return (
    <Link
      key={navLinkData.href}
      href={navLinkData.href}
      className={`text-sm font-medium transition-colors ${
        pathname === navLinkData.href
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      }`}
      {...(navLinkData.isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {navLinkData.label}
    </Link>
  );
};
