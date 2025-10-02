import Link from "next/link";
import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";

export const footerLinkFragment = graphql(`
  fragment FooterLink on FooterLink {
    label
    href
    isExternal
  }
`);

interface FooterLinkProps {
  data: FragmentOf<typeof footerLinkFragment>;
}

export const FooterLink = ({ data }: FooterLinkProps) => {
  const footerLinkData = readFragment(footerLinkFragment, data);

  if (!footerLinkData.href) return null;
  return (
    <Link
      key={footerLinkData.href}
      href={footerLinkData.href}
      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      {...(footerLinkData.isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {footerLinkData.label}
    </Link>
  );
};
